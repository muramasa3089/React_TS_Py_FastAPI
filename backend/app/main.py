from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import deque
import torch
import torch.nn as nn
import torch.optim as optim
import random

app = FastAPI()

# CORS設定（React用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite開発サーバ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ハイパーパラメータ ===
INPUT_SIZE = 3
HIDDEN_SIZE = 32
NUM_LAYERS = 1
SEQ_LENGTH = 10
LEARNING_RATE = 0.01

# === LSTMモデル定義 ===
class JankenLSTM(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, num_layers=NUM_LAYERS, batch_first=True)
        self.fc = nn.Linear(HIDDEN_SIZE, INPUT_SIZE)

    def forward(self, x):
        h_0 = torch.zeros(NUM_LAYERS, x.size(0), HIDDEN_SIZE)
        c_0 = torch.zeros(NUM_LAYERS, x.size(0), HIDDEN_SIZE)
        out, _ = self.lstm(x, (h_0, c_0))
        return self.fc(out[:, -1, :])

# === モデル・最適化器の初期化 ===
model = JankenLSTM()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# === バッファ・ユーティリティ ===
buffer = deque(maxlen=100)
hands = ["グー", "チョキ", "パー"]
onehot_map = {"グー": [1, 0, 0], "チョキ": [0, 1, 0], "パー": [0, 0, 1]}
label_map = {"グー": 0, "チョキ": 1, "パー": 2}
label_to_hand = ["グー", "チョキ", "パー"]

# 勝てる手のマッピングを追加（グローバルに）
winning_hand = {
    "グー": "パー",
    "チョキ": "グー",
    "パー": "チョキ"
}

# 勝敗判定ロジック
def judge(player: str, computer: str) -> str:
    if player == computer:
        return "あいこ"
    elif (player == "グー" and computer == "チョキ") or \
         (player == "チョキ" and computer == "パー") or \
         (player == "パー" and computer == "グー"):
        return "勝ち"
    else:
        return "負け"

# === 次の手を予測（LSTM） ===
def predict_hand():
    if len(buffer) < SEQ_LENGTH:
        return random.choice(hands)
    seq = list(buffer)[-SEQ_LENGTH:]
    x = torch.tensor([[onehot_map[h] for h in seq]], dtype=torch.float32)
    with torch.no_grad():
        out = model(x)
        pred = torch.argmax(out, dim=1).item()
        predicted_hand = label_to_hand[pred]
        # 勝てる手を返す
        return winning_hand[predicted_hand]

# === 学習処理 ===
def train():
    if len(buffer) < SEQ_LENGTH + 1:
        return
    X, y = [], []
    for i in range(len(buffer) - SEQ_LENGTH):
        seq = [onehot_map[h] for h in list(buffer)[i:i + SEQ_LENGTH]]
        label = label_map[buffer[i + SEQ_LENGTH]]
        X.append(seq)
        y.append(label)
    if X:
        X = torch.tensor(X, dtype=torch.float32)
        y = torch.tensor(y, dtype=torch.long)
        optimizer.zero_grad()
        out = model(X)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()

# 型定義
class JankenRequest(BaseModel):
    player: str
    matchCount: int

class JankenResponse(BaseModel):
    player: str
    computer: str
    result: str


@app.post("/janken", response_model=JankenResponse)
async def play_janken(req: JankenRequest):
    player = req.player
    matchCount = req.matchCount
    #computer = random.choice(hands)
    computer = predict_hand()
    result = judge(player, computer)

    # バッファに追加
    buffer.append(player)

     # ゲーム回数が10の倍数のときだけ学習
    if matchCount % 10 == 0:
        train()
    
    return {
        "player": req.player,
        "computer": computer,
        "result": result
    }
