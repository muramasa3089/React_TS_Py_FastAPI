import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOver = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 text-center">
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      <p className="mb-6">5秒以内に手を選ばなかったため終了しました。</p>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
        onClick={() => navigate('/')}
      >
        もう一度プレイ
      </button>
    </div>
  );
};

export default GameOver;
