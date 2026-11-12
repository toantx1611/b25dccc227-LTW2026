import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';
import { calcChange, validateBet, getResult } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';

const APP_TITLE = 'Đặt cược kiến thức';

const Play = ({ questions, loading, error, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(0);
  const [betInput, setBetInput] = useState('100');
  const [rounds, setRounds] = useState([]);
  const [selected, setSelected] = useState(null); // vị trí đã chọn, null = hết giờ
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  // Quyền trợ giúp: lưu số thứ tự câu đã dùng, null = chưa dùng
  const [supports, setSupports] = useState({ preview: null, insurance: null, hint: null });

  const question = questions[index];
  const total = questions.length;

  // Lộ kết quả: choice là vị trí đáp án đã chọn, null nếu hết giờ
  const reveal = (choice) => {
    const correct = choice === question.answer;
    const insured = supports.insurance === index;
    const change = !correct && insured ? 0 : calcChange(bet, question.level, correct);
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

  const handleUseSupport = (key) => {
    setSupports({ ...supports, [key]: index });
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
        const correctCount = rounds.filter((r) => r.correct).length;
        onFinish({
          id: Date.now(),
          name: playerName,
          finalScore,
          correctCount,
          played: rounds.length,
          result: getResult(finalScore),
          playedAt: new Date().toLocaleString('vi-VN'),
        });
        navigate('/result', {
          replace: true,
          state: {
            name: playerName,
            rounds,
            finalScore,
            correctCount,
            reason: bankrupt ? 'bankrupt' : 'completed',
          },
        });
      } else {
        setIndex(index + 1);
        setBetInput('100');
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt ở bước đặt cược: ↑ tăng, ↓ giảm, Enter đặt cược
  useEffect(() => {
    if (status !== 'betting') return;
    const maxBet = Math.floor(Math.min(MAX_BET, score) / BET_STEP) * BET_STEP;

    const handleKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const current = Number(betInput) || MIN_BET;
        const next = e.key === 'ArrowUp' ? current + BET_STEP : current - BET_STEP;
        setBetInput(String(Math.min(maxBet, Math.max(MIN_BET, next))));
      } else if (e.key === 'Enter') {
        const value = Number(betInput);
        if (validateBet(value, score) === '') {
          e.preventDefault();
          handleBet(value);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, betInput, score]);

  // Tiêu đề tab, rời màn hình chơi thì trả lại tiêu đề mặc định
  useEffect(() => {
    if (!question) return;
    document.title =
      status === 'betting'
        ? `Câu ${index + 1}/${total} – đặt cược`
        : `Câu ${index + 1}/${total} – cược ${bet}`;
    return () => {
      document.title = APP_TITLE;
    };
  }, [status, index, total, bet, question]);

  if (!playerName.trim()) return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!question) return null;

  const last = rounds[rounds.length - 1];
  let feedback = '';
  if (status === 'revealed') {
    const insured = !last.correct && supports.insurance === index;
    const amount = insured
      ? 'Bảo hiểm: không bị trừ điểm'
      : `${last.change >= 0 ? '+' : '−'}${formatScore(Math.abs(last.change))}`;
    feedback = selected === null ? `Hết giờ! ${amount}` : amount;
  }

  const done = index + (status === 'revealed' ? 1 : 0);

  return (
    <div className="play">
      <div className="play-head">
        <span>Người chơi: <strong>{playerName}</strong></span>
        <div className="progress"><div style={{ width: `${(done / total) * 100}%` }} /></div>
      </div>

      {status === 'betting' ? (
        <BetPanel
          key={index}
          index={index}
          total={total}
          question={question}
          score={score}
          betInput={betInput}
          onChange={setBetInput}
          onBet={handleBet}
          preview={supports.preview === index}
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
            hint={supports.hint === index ? question.hint : null}
          />
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === 'revealed' && (
            <p className={`feedback ${last.correct ? 'good' : 'bad'}`}>{feedback}</p>
          )}
        </>
      )}

      <Supports supports={supports} status={status} onUse={handleUseSupport} />
    </div>
  );
};

export default Play;
