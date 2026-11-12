import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionDetail = ({ questions, loading, error, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="error">{error}</p>;

  const q = questions.find((item) => item.id === Number(id));
  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const marked = bookmarks.includes(q.id);

  return (
    <div>
      <h2>{`Câu hỏi số ${q.id} – ${q.topic} · ${LEVELS[q.level]} (${formatMultiplier(MULTIPLIERS[q.level])})`}</h2>
      <p className="question-text">{q.question}</p>

      <ul className="options">
        {q.options.map((option, i) => (
          <li key={i} className={i === q.answer ? 'correct' : ''}>
            {LETTERS[i]}. {option}
            {i === q.answer && ' (Đáp án đúng)'}
          </li>
        ))}
      </ul>

      <p>Gợi ý: {q.hint}</p>

      <div className="actions">
        <button onClick={() => toggleBookmark(q.id)}>
          {marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default QuestionDetail;
