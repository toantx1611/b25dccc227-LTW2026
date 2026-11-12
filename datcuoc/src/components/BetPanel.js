import { formatScore } from '../data';
import { validateBet, describeQuestion } from '../utils';

// betInput là chuỗi, state được giữ ở Play để phím tắt ↑ ↓ cũng đổi được
const BetPanel = ({ index, total, question, score, betInput, onChange, onBet, preview }) => {
  const error = validateBet(Number(betInput), score);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) onBet(Number(betInput));
  };

  return (
    <form className="card bet-panel" onSubmit={handleSubmit}>
      <p className="meta">{describeQuestion(index, total, question)}</p>
      <p className="score-line">Điểm hiện có: {formatScore(score)}</p>

      {preview && <p className="preview">🔍 {question.question}</p>}

      <label htmlFor="bet">Mức cược</label>
      <input
        id="bet"
        type="number"
        value={betInput}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <p className="tip">Phím tắt: ↑ tăng, ↓ giảm, Enter để đặt cược</p>

      <button type="submit" className="btn primary" disabled={!!error}>
        Đặt cược
      </button>
    </form>
  );
};

export default BetPanel;
