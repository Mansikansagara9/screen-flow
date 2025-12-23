import { AppStateChangeListener, AppStateStatus } from '../types';

declare const require: any;

/**
 * Platform-agnostic AppState listener.
 * Automatically detects React Native vs Web.
 */
export class AppStateListener {
    private listener: AppStateChangeListener;

    constructor(listener: AppStateChangeListener) {
        this.listener = listener;
        this.init();
    }

    private init() {
        // Check if we are in React Native
        try {
            // Use dynamic require to avoid bundling RN in web builds
            const { AppState } = require('react-native');
            if (AppState && AppState.addEventListener) {
                AppState.addEventListener('change', (nextState: string) => {
                    if (nextState === 'active') {
                        this.listener('active');
                    } else if (nextState === 'background' || nextState === 'inactive') {
                        this.listener('background');
                    }
                });
                return;
            }
        } catch (e) {
            // React Native not available, fallback to Web
        }

        // Fallback to Web (document visibility API)
        if (typeof document !== 'undefined' && document.addEventListener) {
            document.addEventListener('visibilitychange', () => {
                const status: AppStateStatus = document.visibilityState === 'visible' ? 'active' : 'background';
                this.listener(status);
            });
        }
    }
}
