import { TIME_PER_QUESTION } from '../data';

const Timer = ({ timeLeft }) => {
  const danger = timeLeft <= 5;
  const percent = (Math.max(0, timeLeft) / TIME_PER_QUESTION) * 100;

  return (
    <div className="timer-wrap">
      <p className={danger ? 'timer danger' : 'timer'}>⏱ Còn {timeLeft} giây</p>
      <div className="timer-bar">
        <div className={danger ? 'fill danger' : 'fill'} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default Timer;
