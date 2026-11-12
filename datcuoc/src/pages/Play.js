import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from '../data';
import { calcChange } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';

const Play = ({ questions, loading, error, playerName }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [selected, setSelected] = useState(null); // vị trí đã chọn, null = chưa chọn / hết giờ
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];
  const total = questions.length;

  // Lộ kết quả: choice là vị trí đáp án đã chọn, null nếu hết giờ
  const reveal = (choice) => {
    const correct = choice === question.answer;
    const change = calcChange(bet, question.level, correct);
    const scoreAfter = score + change;
    setScore(scoreAfter);
    setRounds([...rounds, { id: question.id, bet, correct, change, scoreAfter }]);
    setSelected(choice);
    setStatus('revealed');
  };

  const handleBet = (value) => {
    setBet(value);
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setStatus('answering');
  };

  const handleSelect = (i) => {
    if (status === 'answering') reveal(i);
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ: xử lý như trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) reveal(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  // Chờ 2 giây rồi sang câu tiếp theo hoặc kết thúc
  useEffect(() => {
    if (status !== 'revealed') return;
    const id = setTimeout(() => {
      const finalScore = rounds[rounds.length - 1].scoreAfter;
      const bankrupt = finalScore < MIN_BET;
      if (bankrupt || index + 1 >= total) {
        navigate('/result', {
          replace: true,
          state: {
            name: playerName,
            rounds,
            finalScore,
            correctCount: rounds.filter((r) => r.correct).length,
            reason: bankrupt ? 'bankrupt' : 'completed',
          },
        });
      } else {
        setIndex(index + 1);
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!playerName.trim()) return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!question) return null;

  const last = rounds[rounds.length - 1];
  let feedback = '';
  if (status === 'revealed') {
    const amount = `${last.change >= 0 ? '+' : '−'}${formatScore(Math.abs(last.change))}`;
    feedback = selected === null ? `Hết giờ! ${amount}` : amount;
  }

  return (
    <div className="play">
      <p className="player-line">Người chơi: <strong>{playerName}</strong></p>

      {status === 'betting' ? (
        <BetPanel
          key={index}
          index={index}
          total={total}
          question={question}
          score={score}
          onBet={handleBet}
        />
      ) : (
        <>
          <QuestionCard
            index={index}
            total={total}
            question={question}
            selected={selected}
            revealed={status === 'revealed'}
            onSelect={handleSelect}
          />
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === 'revealed' && (
            <p className={`feedback ${last.correct ? 'good' : 'bad'}`}>{feedback}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Play;
