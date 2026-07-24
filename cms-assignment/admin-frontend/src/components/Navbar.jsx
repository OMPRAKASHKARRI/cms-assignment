import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';

export default function Navbar({ onMenuClick }) {
  const admin = useSelector((s) => s.auth.admin);
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8">
      <button className="md:hidden text-2xl" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Toggle dark mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{admin?.username}</p>
          <p className="text-xs text-gray-500">{admin?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
