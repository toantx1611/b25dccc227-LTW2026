import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <header className="navbar">
    <span className="brand">🎲 Đặt cược kiến thức</span>
    <nav>
      <NavLink to="/" end>Trang chủ</NavLink>
      <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>
      <NavLink to="/history">Lịch sử</NavLink>
    </nav>
  </header>
);

export default NavBar;
