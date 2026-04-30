import * as signalR from "@microsoft/signalr";

class SignalRService {
	private connection: signalR.HubConnection | null = null;
	private hubUrl: string = "https://localhost:7296/projectHub";
	private startPromise: Promise<void> | null = null;

	public async startConnection(): Promise<void> {
		if (this.startPromise) return this.startPromise;
		if (this.connection?.state === signalR.HubConnectionState.Connected) return;

		this.startPromise = (async () => {
			try {
				// Clear previous connection if any
				if (this.connection) {
					await this.stopConnection();
				}

				this.connection = new signalR.HubConnectionBuilder()
					.withUrl(this.hubUrl)
					.withAutomaticReconnect()
					// Only log critical errors from the library itself to reduce noise during StrictMode cycles
					.configureLogging(signalR.LogLevel.Warning)
					.build();

				console.log("SignalR: Connecting...");
				await this.connection.start();
				console.log("SignalR: Connected");
			} catch (err) {
				const error = err as Error;
				// Silently handle the intentional stop during negotiation
				const isAbortError =
					error.message?.includes("stopped during negotiation") ||
					error.name === "AbortError";

				if (!isAbortError && this.connection !== null) {
					console.error("SignalR: Connection failed:", error);
				} else {
					console.warn(
						"SignalR: Connection attempt aborted (normal during rapid reloads).",
					);
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
			this.connection = null;

			try {
				if (conn.state !== signalR.HubConnectionState.Disconnected) {
					await conn.stop();
				}
			} catch {
				// Ignore stop errors
			}
		}
	}

	public simulateIncomingEvent(eventName: string, data: unknown) {
		console.log(`SignalR: Simulating incoming event "${eventName}"`, data);
	}
}

export const signalRService = new SignalRService();
