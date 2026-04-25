import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private hubUrl: string = "https://localhost:7001/hubs/project";

  public async startConnection(): Promise<void> {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      console.log("SignalR: Attempting to connect to hub...");
      // For now, we mock the start
      console.log("SignalR: Connection established (MOCKED)");
    } catch (err) {
      console.error("SignalR: Connection failed: ", err);
    }
  }

  public on(eventName: string, callback: (...args: unknown[]) => void): void {
    if (this.connection) {
      this.connection.on(eventName, callback);
    } else {
      console.log(`SignalR: Subscribed to event "${eventName}" (MOCKED)`);
    }
  }

  public async invoke(methodName: string, ...args: unknown[]): Promise<unknown> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection.invoke(methodName, ...args);
    } else {
      console.log(`SignalR: Invoking "${methodName}" with args:`, args, "(MOCKED)");
      return Promise.resolve();
    }
  }

  public stopConnection(): void {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  public simulateIncomingEvent(eventName: string, data: unknown) {
    console.log(`SignalR: Simulating incoming event "${eventName}"`, data);
  }
}

export const signalRService = new SignalRService();
