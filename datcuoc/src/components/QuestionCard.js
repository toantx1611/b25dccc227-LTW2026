import { LETTERS } from '../data';
import { describeQuestion } from '../utils';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ index, total, question, selected, revealed, onSelect }) => (
  <div className="card">
    <p className="meta">{describeQuestion(index, total, question)}</p>
    <h3 className="question-text">{question.question}</h3>
    <div className="answer-grid">
      {question.options.map((option, i) => {
        let state = 'idle';
        if (revealed) {
          if (i === question.answer) state = 'correct';
          else if (i === selected) state = 'wrong';
        }
        return (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={state}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  </div>
);

export default QuestionCard;
