import { StorageProvider } from '../types';

/**
 * Manages the navigation history stack.
 * Keeps track of the last 30 screens and detects back navigation.
 */
export class FlowManager {
    private history: string[] = [];
    private storage?: StorageProvider;
    private readonly MAX_HISTORY = 30;
    private readonly STORAGE_KEY = 'sf_history';

    constructor(storage?: StorageProvider) {
        this.storage = storage;
        this.init();
    }

    private async init() {
        if (this.storage) {
            const storedHistory = await this.storage.getItem(this.STORAGE_KEY);
            if (storedHistory) {
                try {
                    this.history = JSON.parse(storedHistory);
                } catch (e) {
                    this.history = [];
                }
            }
        }
    }

    public async push(screenName: string): Promise<boolean> {
        const isBack = this.isBackNavigation(screenName);

        this.history.push(screenName);

        if (this.history.length > this.MAX_HISTORY) {
            this.history.shift();
        }

        if (this.storage) {
            await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
        }

        return isBack;
    }

    public getHistory(): string[] {
        return [...this.history];
    }

    public getPreviousScreen(): string | null {
        if (this.history.length < 2) return null;
        return this.history[this.history.length - 2];
    }

    private isBackNavigation(screenName: string): boolean {
        if (this.history.length < 2) return false;

        // Smarter back detection: if the screen exists in the recent history
        // (last 5 screens excluding the current one)
        const recentHistory = this.history.slice(-6, -1);
        return recentHistory.includes(screenName);
    }
}
