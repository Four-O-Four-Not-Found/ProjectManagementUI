import React, { useState } from "react";
import { GitBranch, Mail, Lock, ArrowRight, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const Login: React.FC = () => {
	const { login, loading } = useAuth();
	const navigate = useNavigate();
	const { success, error } = useToast();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login({ email, password });
			success("Welcome back!", "Successfully logged into your workspace.");
			navigate("/");
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Invalid credentials. Please try again.";
			error("Login Failed", message);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6 bg-mesh overflow-hidden relative">
			{/* Decorative blobs */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

			<div className="w-full max-w-md animate-fade-in relative z-10">
				<div className="glass-panel p-8 md:p-10 rounded-[32px] border-white/[0.1] shadow-2xl">
					<div className="flex flex-col items-center mb-10 text-center">
						<div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
							<Target size={32} className="text-slate-900" />
						</div>
						<h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
							FlowState
						</h1>
						<p className="text-slate-400">Precision Project Orchestration</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-6">
						<Input
							label="Work Email"
							type="email"
							placeholder="name@company.com"
							icon={<Mail size={18} />}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<Input
							label="Password"
							type="password"
							placeholder="••••••••"
							icon={<Lock size={18} />}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<div className="flex items-center justify-between text-xs">
							<label className="flex items-center gap-2 text-slate-400 cursor-pointer">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.02]"
								/>
								Remember me
							</label>
							<button type="button" className="text-primary hover:underline">
								Forgot password?
							</button>
						</div>

						<Button
							type="submit"
							className="w-full py-4 text-lg"
							isLoading={loading}
							rightIcon={<ArrowRight size={20} />}
						>
							Sign In
						</Button>
					</form>

					<div className="mt-8">
						<div className="relative flex items-center justify-center mb-8">
							<div className="flex-grow border-t border-white/[0.05]"></div>
							<span className="mx-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
								or connect with
							</span>
							<div className="flex-grow border-t border-white/[0.05]"></div>
						</div>

						<Button
							variant="secondary"
							className="w-full py-4"
							leftIcon={<GitBranch size={20} />}
						>
							GitHub OAuth
						</Button>
					</div>
				</div>

				<p className="text-center mt-8 text-slate-500 text-sm">
					Don't have an account?{" "}
					<button className="text-primary font-bold hover:underline">
						Request Access
					</button>
				</p>
			</div>
		</div>
	);
};

export default Login;
