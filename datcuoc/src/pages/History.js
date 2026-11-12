import { useState } from 'react';
import { formatScore } from '../data';

const History = ({ history, clearHistory }) => {
  const [player, setPlayer] = useState('all');

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử các lượt chơi</h2>
        <div className="card empty">Chưa có lượt chơi nào.</div>
      </div>
    );
  }

  const names = [...new Set(history.map((h) => h.name))];
  const shown = player === 'all' ? history : history.filter((h) => h.name === player);
  const sorted = [...shown].sort((a, b) => b.finalScore - a.finalScore);
  const best = shown.reduce((max, h) => Math.max(max, h.finalScore), 0);
  const bankruptCount = shown.filter((h) => h.result === 'Cháy túi').length;

  const handleClear = () => {
    clearHistory();
    setPlayer('all');
  };

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>

      <div className="filters">
        <label htmlFor="player">Người chơi:</label>
        <select id="player" value={player} onChange={(e) => setPlayer(e.target.value)}>
          <option value="all">Tất cả</option>
          {names.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button className="btn danger" onClick={handleClear}>Xóa lịch sử</button>
      </div>

      <div className="stats">
        <div className="stat"><p>Số lượt chơi: {shown.length}</p></div>
        <div className="stat"><p>Điểm cao nhất: {formatScore(best)}</p></div>
        <div className="stat"><p>Số lần cháy túi: {bankruptCount}</p></div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.correctCount}/{h.played}</td>
              <td>{formatScore(h.finalScore)}</td>
              <td>{h.result}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
