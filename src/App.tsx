import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import ListView from "./pages/ListView";
import Team from "./pages/Team";
import GitHubAdmin from "./pages/GitHubAdmin";
import Login from "./pages/Login";
import JoinTeam from "./pages/JoinTeam";
import Sprints from "./pages/Sprints";
import Settings from "./pages/Settings";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastProvider } from "./context/ToastProvider";
import { SignalRProvider } from "./context/SignalRProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { ConfirmProvider } from "./context/ConfirmProvider";

import { useAuthStore } from "./store/useAuthStore";

function App() {
	const { isAuthenticated } = useAuthStore();

	return (
		<Provider store={store}>
			<ThemeProvider>
				<ToastProvider>
					<ConfirmProvider>
						<SignalRProvider>
							<Router>
								<Routes>
									<Route path="/login" element={<Login />} />
									{isAuthenticated ? (
										<Route path="/" element={<MainLayout />}>
											<Route index element={<Dashboard />} />
											<Route path="project/:projectId" element={<Board />} />
											<Route
												path="project/:projectId/sprints"
												element={<Sprints />}
											/>
											<Route path="board" element={<Board />} />
											<Route path="list" element={<ListView />} />
											<Route path="github" element={<GitHubAdmin />} />
											<Route path="team" element={<Team />} />
											<Route path="settings" element={<Settings />} />
											<Route path="join/:inviteCode" element={<JoinTeam />} />
											<Route path="*" element={<Navigate to="/" replace />} />
										</Route>
									) : (
										<Route
											path="*"
											element={<Navigate to="/login" replace />}
										/>
									)}
								</Routes>
							</Router>
						</SignalRProvider>
					</ConfirmProvider>
				</ToastProvider>
			</ThemeProvider>
		</Provider>
	);
}

export default App;
