/**
 * Represents a single screen event in the navigation flow.
 */
export interface ScreenEvent {
    screen: string;
    previousScreen: string | null;
    duration: number; // in milliseconds
    flow: string[]; // up to last 30 screens
    isBack: boolean;
    sessionId: string;
    timestamp: number;
    params?: Record<string, any>;
}

/**
 * Interface for output adapters.
 */
export interface Adapter {
    onEvent(event: ScreenEvent): void;
}

/**
 * Interface for storage providers (persistence).
 */
export interface StorageProvider {
    getItem(key: string): string | null | Promise<string | null>;
    setItem(key: string, value: string): void | Promise<void>;
    removeItem(key: string): void | Promise<void>;
}

/**
 * Options for initializing the ScreenTracker.
 */
export interface TrackerOptions {
    adapter?: Adapter;
    storage?: StorageProvider;
    sessionTimeout?: number; // in milliseconds, default 30 mins
}

/**
 * App state types to unify React and React Native behavior.
 */
export type AppStateStatus = 'active' | 'background';
export type AppStateChangeListener = (status: AppStateStatus) => void;
