import { formatScore } from '../data';

const CHART_HEIGHT = 200;

const ScoreChart = ({ rounds }) => {
  const max = Math.max(...rounds.map((r) => r.scoreAfter), 1);

  return (
    <div className="chart">
      {rounds.map((r, i) => (
        <div className="bar-col" key={r.id}>
          <span className="bar-value">{formatScore(r.scoreAfter)}</span>
          <div
            className={`bar ${r.correct ? 'good' : 'bad'}`}
            style={{ height: Math.round((r.scoreAfter / max) * CHART_HEIGHT) }}
          />
          <span className="bar-label">{i + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreChart;
