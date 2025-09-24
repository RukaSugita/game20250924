import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const stations = [
  {
    name: "東京",
    hints: ["多くの新幹線の始発駅", "丸の内や八重洲口がある", "皇居の最寄り駅の一つ"]
  },
  {
    name: "新宿",
    hints: ["世界一乗降客数が多い駅", "東京都庁の最寄り駅", "バスタ新宿が隣接"]
  },
  {
    name: "渋谷",
    hints: ["ハチ公像がある", "スクランブル交差点が有名", "多くの若者文化の発信地"]
  },
  {
    name: "横浜",
    hints: ["神奈川県最大のターミナル駅", "そごうや高島屋が直結", "みなとみらい線に乗り換え可能"]
  },
  {
    name: "大宮",
    hints: ["埼玉県の交通の要所", "鉄道博物館が近くにある", "多くの新幹線が停車する"]
  },
  {
    name: "品川",
    hints: ["リニア中央新幹線の始発駅予定地", "東海道新幹線の停車駅", "駅周辺に多くのオフィスビルが立ち並ぶ"]
  },
  {
    name: "池袋",
    hints: ["サンシャインシティが有名", "東武百貨店と西武百貨店がある", "乙女ロードがある"]
  }
];

const App = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const currentStation = stations[currentQuestionIndex];

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;

    const normalizedGuess = userGuess.replace(/駅$/, '').trim();
    const normalizedAnswer = currentStation.name.replace(/駅$/, '').trim();

    if (normalizedGuess.toLowerCase() === normalizedAnswer.toLowerCase()) {
      setFeedback('正解！ 🎉');
    } else {
      setFeedback(`不正解... 正解は「${currentStation.name}」でした。`);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setFeedback('');
    setUserGuess('');
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % stations.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">関東駅名クイズ</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">ヒント:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {currentStation.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleGuess}>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            disabled={isAnswered}
            placeholder="駅名を入力"
            aria-label="駅名を入力"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isAnswered}
            className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-300"
          >
            回答する
          </button>
        </form>

        {feedback && (
          <p className={`mt-4 text-center text-lg font-semibold ${feedback.includes('正解') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}

        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full mt-4 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
          >
            次の問題へ
          </button>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
