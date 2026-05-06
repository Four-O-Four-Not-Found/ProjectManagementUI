import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	zIndex?: string;
}

const SIZES = {
	sm: "max-w-md",
	md: "max-w-xl",
	lg: "max-w-3xl",
	xl: "max-w-5xl",
};

const BaseModal: React.FC<BaseModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = "md",
	zIndex = "z-[10000]",
}) => {
	const [mounted, setMounted] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		requestAnimationFrame(() => setMounted(true));
		
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const modalContent = (
		<AnimatePresence>
			{isOpen && (
				<div className={twMerge("fixed inset-0 flex items-center justify-center p-4 overflow-hidden", zIndex)}>
					{/* Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
					/>

					{/* Modal Container */}
					<motion.div
						initial={
							isMobile
								? { y: "100%" }
								: { opacity: 0, scale: 0.95, y: 20 }
						}
						animate={
							isMobile
								? { y: 0 }
								: { opacity: 1, scale: 1, y: 0 }
						}
						exit={
							isMobile
								? { y: "100%" }
								: { opacity: 0, scale: 0.95, y: 20 }
						}
						transition={{
							type: "spring",
							damping: 30,
							stiffness: 300,
							mass: 0.8,
						}}
						className={`relative w-full ${SIZES[size]} matte-panel shadow-2xl overflow-hidden flex flex-col h-full md:h-auto md:max-h-[90vh] mt-auto md:mt-0 rounded-t-[var(--radius-xl)] md:rounded-[var(--radius-xl)]`}
					>
						{/* Header */}
						<div className="px-4 py-4 md:py-3 border-b border-border flex items-center justify-between bg-[var(--accent-primary)]/10 backdrop-blur-md shrink-0">
							<div className="flex-1">
								{typeof title === "string" ? (
									<h3 className="text-base md:text-sm font-bold text-text-main tracking-tight">
										{title}
									</h3>
								) : (
									title
								)}
							</div>
							<button
								onClick={onClose}
								className="p-2 md:p-1.5 rounded-xl md:rounded-md hover:bg-background/50 text-text-muted hover:text-text-main transition-all ml-4"
							>
								<X size={20} className="md:w-[18px] md:h-[18px]" />
							</button>
						</div>

						{/* Body */}
						<div className="flex-1 overflow-y-auto p-5 md:p-6 scrollbar-custom bg-background/30 backdrop-blur-sm pb-24 md:pb-6">
							{children}
						</div>

						{/* Footer */}
						{footer && (
							<div className="px-4 py-4 md:py-3 border-t border-border bg-[var(--accent-primary)]/10 backdrop-blur-md flex items-center justify-end gap-3 shrink-0 pb-safe-offset">
								{footer}
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);

	if (!mounted) return null;

	return createPortal(modalContent, document.body);
};

export default BaseModal;
