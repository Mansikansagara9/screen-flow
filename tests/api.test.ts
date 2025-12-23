import { initScreenFlow, onScreenChange, tracker } from '../src/index';

describe('Functional API', () => {
    beforeEach(() => {
        tracker.clearInstance();
    });

    it('should correctly proxy tracker calls', async () => {
        const mockAdapter = { onEvent: jest.fn() };
        initScreenFlow({ adapter: mockAdapter });

        await onScreenChange('Home');

        expect(mockAdapter.onEvent).toHaveBeenCalledWith(expect.objectContaining({
            screen: 'Home'
        }));
    });

    it('should support storage configuration', async () => {
        const mockStorage = {
            getItem: jest.fn().mockResolvedValue(null),
            setItem: jest.fn().mockResolvedValue(undefined),
            removeItem: jest.fn()
        };

        initScreenFlow({ storage: mockStorage });
        await onScreenChange('Home');

        expect(mockStorage.setItem).toHaveBeenCalledWith('sf_history', JSON.stringify(['Home']));
    });
});
