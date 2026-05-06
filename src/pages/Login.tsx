import React, { useEffect } from "react";
import { GitBranch } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/atoms/Button";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { setToken, isAuthenticated } = useAuthStore();
	const { success, warning: toastWarning } = useToast();

	const isProcessing = !!searchParams.get("token");

	useEffect(() => {
		const token = searchParams.get("token");
		const error = searchParams.get("error");

		if (error === "access_denied") {
			toastWarning(
				"Authorization Cancelled",
				"GitHub access was denied. You need to authorize the app to access your project.",
			);
			// Clean up URL
			navigate("/login", { replace: true });
			return;
		}

		if (token) {
			// Small delay to show the beautiful loader and ensure state is synced
			const timer = setTimeout(() => {
				setToken(token);
				success(
					"Authentication Successful",
					"Welcome to your FlowState project.",
				);
				navigate("/");
			}, 1500);
			return () => clearTimeout(timer);
		} else if (isAuthenticated) {
			navigate("/");
		}
	}, [
		searchParams,
		setToken,
		navigate,
		success,
		toastWarning,
		isAuthenticated,
	]);

	if (isProcessing) {
		return <LoadingScreen />;
	}

	const handleGitHubLogin = () => {
		const apiUrl = import.meta.env.VITE_API_URL;
		window.location.href = `${apiUrl}/auth/login-github`;
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6 bg-mesh overflow-hidden relative">
			{/* Decorative blobs */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

			<div className="w-full max-w-md animate-fade-in relative z-10">
				<div className="glass-panel p-10 md:p-12 rounded-[40px] border-[var(--card-border)] shadow-2xl flex flex-col items-center">
					<div className="flex flex-col items-center mb-12 text-center">
						<div className="w-20 h-20 rounded-3xl bg-surface border border-[var(--card-border)] flex items-center justify-center mb-8 shadow-2xl">
							<img src="/favicon.svg" alt="FlowState" className="w-12 h-12 object-contain" />
						</div>
						<h1 className="text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tighter">
							FlowState
						</h1>
						<p className="text-text-muted text-lg">
							Precision Project Orchestration
						</p>
					</div>

					<div className="w-full space-y-6">
						<div className="text-center space-y-2 mb-8">
							<h2 className="text-[var(--text-primary)] font-medium">Access Restricted</h2>
							<p className="text-text-muted text-sm">
								Please authenticate with your GitHub project account to
								proceed.
							</p>
						</div>

						<Button
							variant="primary"
							className="w-full py-5 text-lg font-black tracking-tight"
							leftIcon={<GitBranch size={24} />}
							onClick={handleGitHubLogin}
						>
							Continue with GitHub
						</Button>

						<p className="text-[10px] text-center text-text-muted uppercase tracking-widest font-bold mt-8">
							Authorized Project Access Only
						</p>
					</div>
				</div>

				<div className="mt-12 flex justify-center gap-6 opacity-40">
					<div className="w-2 h-2 rounded-full bg-slate-500"></div>
					<div className="w-2 h-2 rounded-full bg-slate-500"></div>
					<div className="w-2 h-2 rounded-full bg-slate-500"></div>
				</div>
			</div>
		</div>
	);
};

export default Login;
