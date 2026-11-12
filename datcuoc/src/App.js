const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const BOOKMARKS_KEY = 'ltw_cuoc_bookmarks';
const HISTORY_KEY = 'ltw_cuoc_history';

// Đọc mảng từ localStorage, lỗi hoặc sai dạng thì trả về mảng rỗng
const loadList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const saveList = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // bỏ qua nếu không ghi được
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState(() => loadList(BOOKMARKS_KEY));
  const [history, setHistory] = useState(() => loadList(HISTORY_KEY));
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    document.documentElement.dataset.build = BUILD_TAG;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy: bỏ qua
        setError('Không tải được câu hỏi.');
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Ghi lại localStorage mỗi khi thay đổi
  useEffect(() => saveList(BOOKMARKS_KEY, bookmarks), [bookmarks]);
  useEffect(() => saveList(HISTORY_KEY, history), [history]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const addHistory = (record) => setHistory((prev) => [...prev, record]);
  const clearHistory = () => setHistory([]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              loading={loading}
              error={error}
              playerName={playerName}
              onFinish={addHistory}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} clearHistory={clearHistory} />}
        />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              loading={loading}
              error={error}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              loading={loading}
              error={error}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
