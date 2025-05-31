import { useState } from 'react';
import { HandButton } from '../components/HandButton';

const hands = ['グー', 'チョキ', 'パー'] as const;
type Hand = typeof hands[number];

// public/assets/以下の画像に対応する絶対パス
const handImageMap: Record<Hand, string> = {
  グー: '/assets/goo.png',
  チョキ: '/assets/choki.png',
  パー: '/assets/pa.png',
};

export default function JankenPage() {
  const [playerHand, setPlayerHand] = useState<Hand | null>(null);
  const [computerHand, setComputerHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const play = async (hand: Hand) => {
    setPlayerHand(hand);

    const res = await fetch('http://localhost:8000/janken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: hand }),
    });
    const data = await res.json();

    setComputerHand(data.computer);
    setResult(data.result);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 結果表示 */}
      <div className="text-center mt-4">
        {result && <h1 className="text-2xl font-bold">結果：{result}</h1>}
      </div>

     {/* 中央の画像表示（左右に並べる） */}
     <div className="flex justify-center items-center flex-1 gap-20 min-h-[200px]">
        {/* あなた */}
        <div className="text-center w-1/2">
          <p className="mb-2 text-lg">あなた</p>
          <div className="h-32">
            {playerHand && (
              <img
                src={handImageMap[playerHand]}
                alt={playerHand}
                //className="w-12 h-12 !important"
                style={{ width: '320px', height: '320px' }}
              />
            )}
          </div>
        </div>

        {/* コンピュータ */}
        <div className="text-center w-1/2">
          <p className="mb-2 text-lg">コンピュータ</p>
          <div className="h-32">
            {computerHand && (
              <img
                src={handImageMap[computerHand]}
                alt={computerHand}
                //className="w-12 h-12 !important"
                style={{ width: '320px', height: '320px' }}
              />
            )}
          </div>
        </div>
      </div> 

      {/* 下部ボタン群 */}
      <div className="flex justify-center gap-8 py-6 bg-red-500">
        {hands.map((hand) => (
          <HandButton key={hand} hand={hand} onClick={() => play(hand)} />
        ))}
      </div>
    </div>
  );
}
