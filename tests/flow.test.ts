import { FlowManager } from '../src/core/flow';

describe('FlowManager', () => {
    let flow: FlowManager;

    beforeEach(() => {
        flow = new FlowManager();
    });

    it('should push screens and return isBack=false for new screens', async () => {
        const isBack1 = await flow.push('Home');
        const isBack2 = await flow.push('Profile');
        expect(isBack1).toBe(false);
        expect(isBack2).toBe(false);
        expect(flow.getHistory()).toEqual(['Home', 'Profile']);
    });

    it('should detect back navigation within last 5 screens', async () => {
        await flow.push('Home');
        await flow.push('Search');
        await flow.push('Profile');
        await flow.push('Settings');

        const isBack = await flow.push('Search');
        expect(isBack).toBe(true);
    });

    it('should not detect back navigation for very old screens', async () => {
        await flow.push('Home');
        await flow.push('A');
        await flow.push('B');
        await flow.push('C');
        await flow.push('D');
        await flow.push('E');
        await flow.push('F');

        const isBack = await flow.push('Home');
        expect(isBack).toBe(false); // Home is now 7th back, limit is 5
    });

    it('should persist history if storage is provided', async () => {
        const mockStorage = {
            getItem: jest.fn().mockResolvedValue(null),
            setItem: jest.fn().mockResolvedValue(undefined),
            removeItem: jest.fn()
        };

        const persistentFlow = new FlowManager(mockStorage);
        await persistentFlow.push('Home');

        expect(mockStorage.setItem).toHaveBeenCalledWith('sf_history', JSON.stringify(['Home']));
    });
});
