import { ConsoleAdapter } from '../src/adapters/console';
import { ScreenEvent } from '../src/types';

describe('ConsoleAdapter', () => {
    it('should log events to console', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const adapter = new ConsoleAdapter();
        const event: ScreenEvent = {
            screen: 'Home',
            previousScreen: null,
            duration: 100,
            flow: ['Home'],
            isBack: false,
            sessionId: 'test-session',
            timestamp: Date.now()
        };

        adapter.onEvent(event);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[ScreenFlow]'),
            event
        );

        // Test back navigation log
        adapter.onEvent({ ...event, isBack: true });
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[BACK]'),
            expect.any(Object)
        );

        consoleSpy.mockRestore();
    });
});
