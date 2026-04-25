import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Team from './pages/Team';
import GitHubAdmin from './pages/GitHubAdmin';
import Login from './pages/Login';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastProvider } from './context/ToastProvider';
import { SignalRProvider } from './context/SignalRProvider';
import { ThemeProvider } from './context/ThemeProvider';

// Placeholder components for routes not yet implemented
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="glass-panel p-12 rounded-3xl text-center">
      <h2 className="text-3xl font-bold water-gradient-text mb-4">{name}</h2>
      <p className="text-slate-400">This module is currently being calibrated...</p>
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <SignalRProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="board" element={<Board />} />
                  <Route path="list" element={<Placeholder name="List View" />} />
                  <Route path="github" element={<GitHubAdmin />} />
                  <Route path="team" element={<Team />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Router>
          </SignalRProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
