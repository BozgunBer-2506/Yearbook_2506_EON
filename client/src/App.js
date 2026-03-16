import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const handleLoginSuccess = () => {
    setUser(JSON.parse(localStorage.getItem('user')));
  };

  // Yearbook is always visible — login only needed to post messages
  return (
    <div style={{ backgroundColor: '#06080e', minHeight: '100vh' }}>
      {!user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;