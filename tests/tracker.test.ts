import { ScreenTracker } from '../src/core/tracker';
import { Adapter } from '../src/types';

describe('ScreenTracker', () => {
    let tracker: ScreenTracker;
    let mockAdapter: Adapter;

    beforeEach(() => {
        jest.useFakeTimers();
        mockAdapter = {
            onEvent: jest.fn()
        };
        tracker = new ScreenTracker({ adapter: mockAdapter });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should track a screen transition', async () => {
        await tracker.track('Home');
        expect(mockAdapter.onEvent).toHaveBeenCalledWith(expect.objectContaining({
            screen: 'Home',
            previousScreen: null,
            isBack: false
        }));

        jest.advanceTimersByTime(1000);
        await tracker.track('Profile');

        expect(mockAdapter.onEvent).toHaveBeenCalledWith(expect.objectContaining({
            screen: 'Profile',
            previousScreen: 'Home',
            duration: expect.any(Number),
            isBack: false
        }));
    });

    it('should ignore duplicate screen tracking', async () => {
        await tracker.track('Home');
        await tracker.track('Home');
        expect(mockAdapter.onEvent).toHaveBeenCalledTimes(1);
    });

    it('should detect back navigation in events', async () => {
        await tracker.track('Home');
        await tracker.track('Profile');
        await tracker.track('Home');

        const calls = (mockAdapter.onEvent as jest.Mock).mock.calls;
        const lastEvent = calls[2][0];
        expect(lastEvent.screen).toBe('Home');
        expect(lastEvent.isBack).toBe(true);
    });

    it('should provides session and history', async () => {
        await tracker.track('Home');
        expect(await tracker.getSessionId()).toBeDefined();
        expect(tracker.getHistory()).toEqual(['Home']);
    });
});
