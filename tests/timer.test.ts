import { ScreenTimer } from '../src/core/timer';

describe('ScreenTimer', () => {
    let timer: ScreenTimer;

    beforeEach(() => {
        jest.useFakeTimers();
        timer = new ScreenTimer();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should start with 0 duration', () => {
        expect(timer.getDuration()).toBe(0);
    });

    it('should track duration after some time', () => {
        jest.advanceTimersByTime(1000);
        expect(timer.getDuration()).toBeGreaterThanOrEqual(1000);
    });

    it('should pause and not count time during pause', () => {
        jest.advanceTimersByTime(1000);
        timer.pause();
        jest.advanceTimersByTime(2000);
        expect(timer.getDuration()).toBeLessThan(2000);
        expect(timer.getDuration()).toBeGreaterThanOrEqual(1000);
    });

    it('should resume and continue counting time', () => {
        timer.pause();
        jest.advanceTimersByTime(1000);
        timer.resume();
        jest.advanceTimersByTime(1000);
        expect(timer.getDuration()).toBeGreaterThanOrEqual(1000);
        expect(timer.getDuration()).toBeLessThan(1500); // Should be exactly ~1000
    });

    it('should reset duration', () => {
        jest.advanceTimersByTime(1000);
        const duration = timer.reset();
        expect(duration).toBeGreaterThanOrEqual(1000);
        expect(timer.getDuration()).toBe(0);
    });
});
