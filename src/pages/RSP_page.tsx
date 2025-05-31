import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [fullHistory, setFullHistory] = useState<string[]>([]);
  const [recentHistory, setRecentHistory] = useState<string[]>([]);

  const navigate = useNavigate();  // ←★追加
  const timerRef = useRef<NodeJS.Timeout | null>(null); // ←★追加

  const [timeLeft, setTimeLeft] = useState(5); // 残り秒数

  useEffect(() => {
     // タイマーのリセット
     if (timerRef.current) clearInterval(timerRef.current);

     // 1秒ごとにカウントダウン
     timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            navigate('/gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      // クリーンアップ
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
  }, []);


  const play = async (hand: Hand) => {
    setPlayerHand(hand);
    setTimeLeft(5); // ←★ここでタイマーをリセット！
    // タイマーのリセットと再セット
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
        if (prev <= 1) {
            clearInterval(timerRef.current!);
            navigate('/gameover');
            return 0;
        }
        return prev - 1;
        });
    }, 1000);

    const res = await fetch('http://localhost:8000/janken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: hand }),
    });
    const data = await res.json();

    setComputerHand(data.computer);
    setResult(data.result);

    // 全体履歴に追加
    setFullHistory(prev => [...prev, data.result]);

    // 直近10戦履歴に追加（先頭に追加し、10件に制限）
    setRecentHistory(prev => [data.result, ...prev].slice(0, 10));

  };

  const calculateWinRate = (records: string[]) => {
    //const total = records.length;
    const win_or_lose = records.filter(r => r === '勝ち' || r === '負け').length; 
    const wins = records.filter(r => r === '勝ち').length;
    return win_or_lose === 0 ? 0 : Math.round((wins / win_or_lose) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-gradient-to-b from-pink-500 to-yellow-300">
        {/* 残り時間表示（右上） */}
      <div  style={{
        position: 'absolute',
        top: '8px',
        right: '16px',
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '44px',
    }}>
        残り時間：{timeLeft} 秒
      </div>

      {/* 結果表示 */}
      <div className="text-center mt-4">
        {result && <h1 className="text-2xl font-bold">結果：{result}</h1>}
      </div>

        {/* 勝率表示 */}
        {fullHistory.length > 0 && (
            <div className="text-center mt-2 text-lg">
                <p>試合数：{fullHistory.length}</p>
                <p>全体の勝率：{calculateWinRate(fullHistory)}%</p>
                <p>直近10戦の勝率：{calculateWinRate(recentHistory)}%</p>
            </div>
        )}

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
      <div className="bg-gray-100 py-6">
        <p className="text-center text-lg font-semibold mb-4">
            手を選んでください
        </p>
        <div className="flex justify-center gap-8">
            {hands.map((hand) => (
            <HandButton key={hand} hand={hand} onClick={() => play(hand)} />
            ))}
        </div>
      </div>


    </div>
  );
}
