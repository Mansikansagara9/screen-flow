/**
 * Handles duration tracking for screens.
 * Automatically pauses when app is backgrounded.
 */
export class ScreenTimer {
    private startTime: number = 0;
    private pausedTime: number = 0;
    private isPaused: boolean = false;
    private lastPauseStart: number = 0;

    constructor() {
        this.start();
    }

    public start() {
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.isPaused = false;
    }

    public pause() {
        if (!this.isPaused) {
            this.lastPauseStart = Date.now();
            this.isPaused = true;
        }
    }

    public resume() {
        if (this.isPaused) {
            this.pausedTime += Date.now() - this.lastPauseStart;
            this.isPaused = false;
        }
    }

    public getDuration(): number {
        if (this.startTime === 0) return 0;

        const currentDuration = Date.now() - this.startTime - this.pausedTime;

        // If currently paused, don't count the time since pause started
        if (this.isPaused) {
            return currentDuration - (Date.now() - this.lastPauseStart);
        }

        return currentDuration;
    }

    public reset(): number {
        const duration = this.getDuration();
        this.start();
        return duration;
    }
}
