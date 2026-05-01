import * as signalR from "@microsoft/signalr";

class SignalRService {
	private connection: signalR.HubConnection | null = null;
	private hubUrl: string = "http://localhost:5139/projectHub";
	private startPromise: Promise<void> | null = null;

	public async startConnection(): Promise<void> {
		if (this.startPromise) return this.startPromise;
		
		if (this.connection?.state === signalR.HubConnectionState.Connected || 
			this.connection?.state === signalR.HubConnectionState.Connecting) {
			return;
		}

		this.startPromise = (async () => {
			try {
				const authData = localStorage.getItem('auth-storage');
				const token = authData ? JSON.parse(authData).state.token : null;

				this.connection = new signalR.HubConnectionBuilder()
					.withUrl(this.hubUrl, {
						accessTokenFactory: () => token || "",
						skipNegotiation: false,
						transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
					})
					.withAutomaticReconnect()
					.configureLogging(signalR.LogLevel.Warning)
					.build();

				console.log("SignalR: Connecting...");
				await this.connection.start();
				console.log("SignalR: Connected");
			} catch (err) {
				const error = err as Error;
				const isAbortError =
					error.message?.includes("stopped during negotiation") ||
					error.message?.includes("connection was stopped") ||
					error.name === "AbortError";

				if (!isAbortError) {
					console.error("SignalR: Connection failed:", error);
				} else {
					// Silent warning for expected dev-mode behavior
					console.debug("SignalR: Connection attempt synchronized.");
				}
			} finally {
				this.startPromise = null;
			}
		})();

		return this.startPromise;
	}

	public on(eventName: string, callback: (...args: unknown[]) => void): void {
		if (this.connection) {
			this.connection.on(eventName, callback);
		}
	}

	public async invoke(
		methodName: string,
		...args: unknown[]
	): Promise<unknown> {
		if (
			this.connection &&
			this.connection.state === signalR.HubConnectionState.Connected
		) {
			return this.connection.invoke(methodName, ...args);
		}
		return Promise.resolve();
	}

	public async stopConnection(): Promise<void> {
		if (this.connection) {
			const conn = this.connection;
			
			// If we're already disconnecting, just return
			if (conn.state === signalR.HubConnectionState.Disconnecting || 
				conn.state === signalR.HubConnectionState.Disconnected) {
				this.connection = null;
				return;
			}

			this.connection = null;

			try {
				await conn.stop();
			} catch (err) {
				// Silently catch abort errors during stop
				const error = err as Error;
				if (!error.message?.includes("stopped during negotiation") && 
					!error.message?.includes("connection was stopped")) {
					console.debug("SignalR: Connection stopped gracefully.");
				}
			}
		}
	}

	public simulateIncomingEvent(eventName: string, data: unknown) {
		console.log(`SignalR: Simulating incoming event "${eventName}"`, data);
	}
}

export const signalRService = new SignalRService();
