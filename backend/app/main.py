from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

# 型定義
class JankenRequest(BaseModel):
    player: str

class JankenResponse(BaseModel):
    player: str
    computer: str
    result: str

hands = ["グー", "チョキ", "パー"]

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

@app.post("/janken", response_model=JankenResponse)
async def play_janken(req: JankenRequest):
    computer = random.choice(hands)
    result = judge(req.player, computer)
    return {
        "player": req.player,
        "computer": computer,
        "result": result
    }
