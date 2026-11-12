// supports.<tên> = số thứ tự câu đã dùng quyền đó, null nếu chưa dùng
const Supports = ({ supports, status, onUse }) => {
  const used = (key) => supports[key] !== null;

  return (
    <div className="supports">
      <button
        type="button"
        className="support"
        disabled={used('preview') || status !== 'betting'}
        onClick={() => onUse('preview')}
      >
        <span className="ico">🔍</span>Xem trước
      </button>
      <button
        type="button"
        className="support"
        disabled={used('insurance') || status === 'revealed'}
        onClick={() => onUse('insurance')}
      >
        <span className="ico">🛡</span>
        {used('insurance') ? 'Đã bảo hiểm' : 'Bảo hiểm'}
      </button>
      <button
        type="button"
        className="support"
        disabled={used('hint') || status !== 'answering'}
        onClick={() => onUse('hint')}
      >
        <span className="ico">💡</span>Gợi ý
      </button>
    </div>
  );
};

export default Supports;
