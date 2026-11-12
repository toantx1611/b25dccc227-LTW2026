import { LEVELS, MULTIPLIERS, RESULTS, MIN_BET, MAX_BET, BET_STEP, formatMultiplier } from './data';

// Trả về câu báo lỗi, hoặc chuỗi rỗng nếu mức cược hợp lệ
export const validateBet = (bet, score) => {
  const valid =
    Number.isInteger(bet) &&
    bet % BET_STEP === 0 &&
    bet >= MIN_BET &&
    bet <= MAX_BET &&
    bet <= score;
  return valid
    ? ''
    : `Mức cược phải là bội số của ${BET_STEP}, từ ${MIN_BET} đến ${MAX_BET} và không vượt quá số điểm đang có`;
};

// Số điểm cộng (đúng) hoặc trừ (sai / hết giờ)
export const calcChange = (bet, level, correct) =>
  correct ? bet * MULTIPLIERS[level] : -bet;

// Mục đầu tiên trong RESULTS có điểm >= min
export const getResult = (score) => RESULTS.find((r) => score >= r.min).title;

// "Câu 6/12 · CSS · Trung bình (x1,5)"
export const describeQuestion = (index, total, q) =>
  `Câu ${index + 1}/${total} · ${q.topic} · ${LEVELS[q.level]} (${formatMultiplier(MULTIPLIERS[q.level])})`;
