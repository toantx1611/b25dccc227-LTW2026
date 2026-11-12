import { useNavigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, MAX_BET, TIME_PER_QUESTION, formatScore } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const canPlay = playerName.trim() !== '';

  // Lượt có điểm cuối cao nhất
  const best =
    history.length > 0
      ? history.reduce((top, h) => (h.finalScore > top.finalScore ? h : top))
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPlay) return;
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Đặt cược kiến thức</h1>
        <p>Trắc nghiệm HTML, CSS, JavaScript, React: thử vận may với điểm số của bạn.</p>
        {best && (
          <p className="record">
            <span>🏆</span> Kỷ lục: {formatScore(best.finalScore)} – {best.name}
          </p>
        )}
      </div>

      <div className="card">
        <h3>Luật chơi</h3>
        <ul className="rules">
          <li>Bắt đầu với {formatScore(START_SCORE)}, đi qua 12 câu hỏi.</li>
          <li>Trước mỗi câu chỉ biết chủ đề và mức độ, hãy đặt cược từ {MIN_BET} đến {MAX_BET} điểm.</li>
          <li>Câu hỏi hiện ra, bạn có {TIME_PER_QUESTION} giây để trả lời.</li>
          <li>Đúng: được thưởng mức cược × hệ số (Dễ x1, Trung bình x1,5, Khó x2).</li>
          <li>Sai hoặc hết giờ: mất đúng số điểm đã cược.</li>
          <li>Còn dưới {MIN_BET} điểm là cháy túi, lượt chơi kết thúc.</li>
          <li>Có 3 quyền trợ giúp, mỗi quyền dùng một lần: Xem trước, Bảo hiểm, Gợi ý.</li>
        </ul>
      </div>

      <form className="card name-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Tên người chơi</label>
        <input
          id="name"
          type="text"
          placeholder="Nhập tên của bạn"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" className="btn primary" disabled={!canPlay}>
          Vào chơi
        </button>
      </form>
    </div>
  );
};

export default Home;
