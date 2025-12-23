import { Adapter, ScreenEvent } from '../types';

/**
 * Default adapter that logs screen events to the console.
 */
export class ConsoleAdapter implements Adapter {
    public onEvent(event: ScreenEvent): void {
        const { screen, duration, isBack, timestamp } = event;
        const date = new Date(timestamp).toLocaleTimeString();

        console.log(
            `[ScreenFlow] ${date} - ${screen} (${duration}ms)${isBack ? ' [BACK]' : ''}`,
            event
        );
    }
}
