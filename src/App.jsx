import { useState } from 'react';
import WelcomePage from './components/WelcomePage.jsx';
import MainApp from './components/MainApp.jsx';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <WelcomePage onLogin={handleLogin} />
      ) : (
        <MainApp onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
