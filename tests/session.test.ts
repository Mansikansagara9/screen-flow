import { SessionManager } from '../src/core/session';

describe('SessionManager', () => {
    it('should generate a unique session ID', async () => {
        const sm1 = new SessionManager();
        const sm2 = new SessionManager();
        const id1 = await sm1.getSessionId();
        const id2 = await sm2.getSessionId();
        expect(id1).toBeDefined();
        expect(id1).not.toBe(id2);
    });

    it('should persist and resume session if within timeout', async () => {
        const mockStorage = {
            getItem: jest.fn((key) => {
                if (key === 'sf_session_id') return 'persistent-id';
                if (key === 'sf_last_activity') return Date.now().toString();
                return null;
            }),
            setItem: jest.fn(),
            removeItem: jest.fn()
        };

        const sm = new SessionManager(mockStorage);
        const id = await sm.getSessionId();

        expect(id).toBe('persistent-id');
        expect(mockStorage.getItem).toHaveBeenCalledWith('sf_session_id');
    });

    it('should start new session if timeout exceeded', async () => {
        const oldTime = Date.now() - (60 * 60 * 1000); // 1 hour ago
        const mockStorage = {
            getItem: jest.fn((key) => {
                if (key === 'sf_session_id') return 'persistent-id';
                if (key === 'sf_last_activity') return oldTime.toString();
                return null;
            }),
            setItem: jest.fn(),
            removeItem: jest.fn()
        };

        const sm = new SessionManager(mockStorage, 30 * 60 * 1000); // 30 min timeout
        const id = await sm.getSessionId();

        expect(id).not.toBe('persistent-id');
    });
});
