import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, Share2, Check } from "lucide-react";
import BaseModal from "../molecules/BaseModal";
import Button from "../atoms/Button";
import { useToast } from "../../hooks/useToast";
import { useState } from "react";

interface TeamInviteModalProps {
	isOpen: boolean;
	onClose: () => void;
	teamName: string;
	inviteCode: string;
}

const TeamInviteModal: React.FC<TeamInviteModalProps> = ({
	isOpen,
	onClose,
	teamName,
	inviteCode,
}) => {
	const { success } = useToast();
	const [copied, setCopied] = useState(false);
	const qrRef = useRef<SVGSVGElement>(null);

	const joinUrl = `${window.location.origin}/join/${inviteCode}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(joinUrl);
		setCopied(true);
		success("Link Copied", "Invitation link has been copied to clipboard.");
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownloadQR = () => {
		const svg = qrRef.current;
		if (!svg) return;

		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx?.drawImage(img, 0, 0);
			const pngFile = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.download = `Invite-${teamName}.png`;
			downloadLink.href = pngFile;
			downloadLink.click();
		};

		img.src = "data:image/svg+xml;base64," + btoa(svgData);
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={`Invite to ${teamName}`}
			size="md"
		>
			<div className="space-y-8 py-4">
				<div className="flex flex-col items-center justify-center space-y-6">
					<div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.2)]">
						<QRCodeSVG
							value={joinUrl}
							size={200}
							level="H"
							includeMargin={true}
							ref={qrRef}
						/>
					</div>
					<div className="text-center">
						<p className="text-sm text-text-muted">Scan this QR code to join the team</p>
						<p className="text-[10px] font-mono text-primary mt-1 uppercase tracking-widest">{inviteCode}</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-xs font-bold text-text-muted uppercase tracking-widest">Invitation Link</label>
						<div className="flex gap-2">
							<div className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-slate-300 font-mono truncate">
								{joinUrl}
							</div>
							<Button
								variant="secondary"
								onClick={handleCopy}
								className="shrink-0"
							>
								{copied ? <Check size={18} /> : <Copy size={18} />}
							</Button>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							fullWidth
							variant="secondary"
							onClick={handleDownloadQR}
							leftIcon={<Download size={18} />}
						>
							Download QR
						</Button>
						<Button
							fullWidth
							variant="success"
							onClick={() => {
								if (navigator.share) {
									navigator.share({
										title: `Join ${teamName} on ProjectManager`,
										text: `You've been invited to join the team ${teamName}. Click the link to join!`,
										url: joinUrl,
									});
								} else {
									handleCopy();
								}
							}}
							leftIcon={<Share2 size={18} />}
						>
							Share
						</Button>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TeamInviteModal;
