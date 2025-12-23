import { AppStateListener } from '../src/lifecycle/appState';

describe('AppStateListener', () => {
    let listener: jest.Mock;

    beforeEach(() => {
        listener = jest.fn();
        jest.resetModules();
    });

    it('should fallback to Web (document) if react-native is not available', () => {
        // Mock document
        const mockAddEventListener = jest.fn();
        (global as any).document = {
            addEventListener: mockAddEventListener,
            visibilityState: 'visible'
        };

        new AppStateListener(listener);
        expect(mockAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

        // Simulate visibility change
        const changeCallback = mockAddEventListener.mock.calls[0][1];

        (global as any).document.visibilityState = 'hidden';
        changeCallback();
        expect(listener).toHaveBeenCalledWith('background');

        (global as any).document.visibilityState = 'visible';
        changeCallback();
        expect(listener).toHaveBeenCalledWith('active');

        delete (global as any).document;
    });

    it('should use react-native AppState if available', () => {
        const mockAddEventListener = jest.fn();
        jest.mock('react-native', () => ({
            AppState: {
                addEventListener: mockAddEventListener
            }
        }), { virtual: true });

        // We need to re-require the module because we're using virtual mocks
        const { AppStateListener } = require('../src/lifecycle/appState');
        new AppStateListener(listener);

        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

        // Simulate AppState change
        const changeCallback = mockAddEventListener.mock.calls[0][1];

        changeCallback('background');
        expect(listener).toHaveBeenCalledWith('background');

        changeCallback('active');
        expect(listener).toHaveBeenCalledWith('active');
    });
});
