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

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
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

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Home playerName={playerName} setPlayerName={setPlayerName} />}
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              loading={loading}
              error={error}
              playerName={playerName}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
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
