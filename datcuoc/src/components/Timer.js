const Timer = ({ timeLeft }) => (
  <p className={timeLeft <= 5 ? 'timer danger' : 'timer'}>
    ⏱ Còn {timeLeft} giây
  </p>
);

export default Timer;
