import { initScreenFlow, onScreenChange, ConsoleAdapter } from "../src";

// Mock storage for testing persistence in Node.js
const mockStorage = {
    data: {} as Record<string, string>,
    getItem(key: string) { return this.data[key] || null; },
    setItem(key: string, value: string) { this.data[key] = value; },
    removeItem(key: string) { delete this.data[key]; }
};

const runTest = async () => {
    console.log("🚀 Starting Comprehensive Manual Test\n");

    // 1. Initialization with persistence
    initScreenFlow({
        adapter: new ConsoleAdapter(),
        storage: mockStorage
    });

    console.log("--- Scenario 1: Basic Navigation & Params ---");
    await onScreenChange("Home", { userType: 'guest' });
    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- Scenario 2: Deep Navigation ---");
    await onScreenChange("Search");
    await new Promise(r => setTimeout(r, 500));
    await onScreenChange("SearchResults", { query: 'react' });
    await new Promise(r => setTimeout(r, 500));
    await onScreenChange("ProductView", { id: 'p1' });
    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- Scenario 3: Smart Back Detection (Jump back to Search) ---");
    // History: Home -> Search -> SearchResults -> ProductView
    // Navigating back to Search should be isBack: true
    await onScreenChange("Search");
    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- Scenario 4: Persistence Check ---");
    console.log("Simulating app restart (new tracker instance, same storage)...");

    // We can't easily recreate the singleton but we can re-init it
    // The storage already has 'sf_history' and 'sf_session_id'
    initScreenFlow({
        adapter: new ConsoleAdapter(),
        storage: mockStorage
    });

    // New navigation after "restart"
    await onScreenChange("Settings");

    console.log("\n✅ Manual testing session complete.");
};

runTest().catch(console.error);
