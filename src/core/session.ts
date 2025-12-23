import { StorageProvider } from '../types';

/**
 * Handles session identification.
 * Generates a unique ID per session, persisted across restarts.
 */
export class SessionManager {
    private sessionId: string | null = null;
    private storage?: StorageProvider;
    private readonly STORAGE_KEY = 'sf_session_id';
    private readonly LAST_ACTIVITY_KEY = 'sf_last_activity';
    private readonly sessionTimeout: number;

    constructor(storage?: StorageProvider, sessionTimeout: number = 30 * 60 * 1000) {
        this.storage = storage;
        this.sessionTimeout = sessionTimeout;
    }

    public async getSessionId(): Promise<string> {
        if (this.sessionId) {
            await this.updateActivity();
            return this.sessionId;
        }

        if (this.storage) {
            const storedId = await this.storage.getItem(this.STORAGE_KEY);
            const lastActivity = await this.storage.getItem(this.LAST_ACTIVITY_KEY);

            if (storedId && lastActivity) {
                const elapsed = Date.now() - parseInt(lastActivity, 10);
                if (elapsed < this.sessionTimeout) {
                    this.sessionId = storedId;
                    await this.updateActivity();
                    return this.sessionId;
                }
            }
        }

        // New session
        this.sessionId = this.generateId();
        if (this.storage) {
            await this.storage.setItem(this.STORAGE_KEY, this.sessionId);
            await this.updateActivity();
        }
        return this.sessionId;
    }

    private async updateActivity() {
        if (this.storage) {
            await this.storage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }
}
