import { formatScore } from '../data';

const ScoreInfo = ({ score, bet }) => (
  <div className="score-info">
    <p>Điểm hiện có: {formatScore(score)}</p>
    <p>Đang cược: {formatScore(bet)}</p>
  </div>
);

export default ScoreInfo;
