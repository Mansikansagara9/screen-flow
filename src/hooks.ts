import { useEffect, useRef } from 'react';
import { onScreenChange } from './index';

/**
 * Hook to automatically track screen changes in React components.
 * 
 * @param screenName The name of the screen to track.
 * @param params Optional parameters for the screen.
 */
export function useScreenFlow(screenName: string, params?: Record<string, any>) {
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Track on mount or whenever screenName/params change
        onScreenChange(screenName, params);

        isFirstRender.current = false;
    }, [screenName, JSON.stringify(params)]);
}
