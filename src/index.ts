export * from './types';
export { ScreenTracker, tracker } from './core/tracker';
export { ConsoleAdapter } from './adapters/console';
import { tracker } from './core/tracker';
import { TrackerOptions } from './types';

/**
 * Initializes the ScreenTracker with custom options (adapter, storage).
 */
export const initScreenFlow = (options: TrackerOptions) => {
    (tracker as any).adapter = options.adapter || (tracker as any).adapter;
    // Update internal managers with storage/options
    if (options.storage) {
        (tracker as any).flow['storage'] = options.storage;
        (tracker as any).session['storage'] = options.storage;
    }
    if (options.sessionTimeout) {
        (tracker as any).session['sessionTimeout'] = options.sessionTimeout;
    }
};

/**
 * Tracks a screen change.
 */
export const onScreenChange = async (screenName: string, params?: Record<string, any>) => {
    await tracker.track(screenName, params);
};

export * from './hooks';

/**
 * Main API for screen tracking.
 * @example
 * import screenFlow from 'screen-flow';
 * await screenFlow.track('Home');
 */
export default tracker;
