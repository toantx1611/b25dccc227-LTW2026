import { useState } from 'react';
import { formatScore } from '../data';
import { validateBet, describeQuestion } from '../utils';

const BetPanel = ({ index, total, question, score, onBet }) => {
  const [bet, setBet] = useState('100');
  const error = validateBet(Number(bet), score);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) onBet(Number(bet));
  };

  return (
    <form className="card bet-panel" onSubmit={handleSubmit}>
      <p className="meta">{describeQuestion(index, total, question)}</p>
      <p className="score-line">Điểm hiện có: {formatScore(score)}</p>

      <label htmlFor="bet">Mức cược</label>
      <input
        id="bet"
        type="number"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
      />
      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn primary" disabled={!!error}>
        Đặt cược
      </button>
    </form>
  );
};

export default BetPanel;
