import { Adapter, ScreenEvent, TrackerOptions } from '../types';
import { ScreenTimer } from './timer';
import { FlowManager } from './flow';
import { SessionManager } from './session';
import { AppStateListener } from '../lifecycle/appState';
import { ConsoleAdapter } from '../adapters/console';

/**
 * Main coordinator for screen tracking.
 * Manages timer, flow, and session across the application lifecycle.
 */
export class ScreenTracker {
    private timer: ScreenTimer;
    private flow: FlowManager;
    private session: SessionManager;
    private adapter: Adapter;
    private currentScreen: string | null = null;

    constructor(options: TrackerOptions = {}) {
        this.timer = new ScreenTimer();
        this.flow = new FlowManager(options.storage);
        this.session = new SessionManager(options.storage, options.sessionTimeout);
        this.adapter = options.adapter || new ConsoleAdapter();

        // Setup platform-agnostic lifecycle listener
        new AppStateListener((status) => {
            if (status === 'background') {
                this.timer.pause();
            } else {
                this.timer.resume();
            }
        });
    }

    /**
     * Tracks a screen change.
     * @param screenName The name of the screen being navigated to.
     * @param params Optional parameters associated with the screen change.
     */
    public async track(screenName: string, params?: Record<string, any>): Promise<void> {
        if (this.currentScreen === screenName) return;

        const previousScreen = this.currentScreen;
        this.currentScreen = screenName;

        // Reset timer and get duration spent on the previous screen
        const duration = this.timer.reset();

        // Update flow and detect if this is a back navigation
        const isBack = await this.flow.push(screenName);

        // Prepare the event
        const event: ScreenEvent = {
            screen: screenName,
            previousScreen,
            duration,
            flow: this.flow.getHistory(),
            isBack,
            sessionId: await this.session.getSessionId(),
            timestamp: Date.now(),
            params
        };

        // Dispatch event to the adapter
        this.adapter.onEvent(event);
    }

    /**
     * Returns the current session ID.
     */
    public async getSessionId(): Promise<string> {
        return await this.session.getSessionId();
    }

    /**
     * Returns the navigation history.
     */
    public getHistory(): string[] {
        return this.flow.getHistory();
    }

    /**
     * Clears the tracker state (useful for tests).
     */
    public clearInstance(): void {
        this.currentScreen = null;
        this.timer.start();
        this.flow = new FlowManager((this as any).storage);
        this.session = new SessionManager((this as any).storage);
    }
}

// Export a singleton instance for easier usage
export const tracker = new ScreenTracker();
