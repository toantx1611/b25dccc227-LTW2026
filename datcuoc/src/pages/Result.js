import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatScore } from '../data';
import { getResult } from '../utils';
import ScoreChart from '../components/ScoreChart';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  const { name, rounds, finalScore, correctCount, reason } = state;

  return (
    <div className="result">
      <h2>{reason === 'bankrupt' ? 'Bạn đã cháy túi!' : 'Bạn đã hoàn thành 12 câu.'}</h2>

      <div className="card summary">
        <p>Người chơi: <strong>{name}</strong></p>
        <p>Số câu trả lời đúng: {correctCount}/{rounds.length}</p>
        <p>Điểm cuối: {formatScore(finalScore)}</p>
        <p>Đánh giá: <strong>{getResult(finalScore)}</strong></p>
      </div>

      <div className="card">
        <h3>Biểu đồ điểm</h3>
        <ScoreChart rounds={rounds} />
      </div>

      <div className="actions">
        <button className="btn primary" onClick={() => navigate('/play')}>Chơi lại</button>
        <button className="btn" onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;
