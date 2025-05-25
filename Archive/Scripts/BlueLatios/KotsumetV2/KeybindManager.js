/* eslint-disable no-empty-function */
class KeybindManager {
    constructor() {
        this.keybinds = new Map();
        this.pressedKeys = new Set();
        this.activeHoldKeybinds = new Set();

        // Bind event listeners
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    /**
     * Register a new keybind
     * @param {string|string[]} keys - Key or array of keys that trigger the keybind
     * @param {Object} options - Configuration options for the keybind
     * @param {Function} options.onExecute - Function to execute when keybind is triggered
     * @param {Function} [options.onKeyDown] - Function to execute on key down
     * @param {Function} [options.onKeyUp] - Function to execute on key up
     * @param {boolean} [options.holdToExecute=false] - Whether to execute while held
     * @param {number} [options.holdDelay=0] - Delay between hold executions in ms
     * @param {boolean} [options.preventDefault=true] - Whether to prevent default key behavior
     * @param {boolean} [options.allowInInput=false] - Whether to trigger in input elements
     * @returns {string} Unique identifier for the keybind
     */
    register(keys, options = {}) {
        const id = crypto.randomUUID();
        const normalizedKeys = Array.isArray(keys) ? keys : [keys];

        // Normalize all keys to lowercase
        const keyArray = normalizedKeys.map(key => this.normalizeKey(key));

        this.keybinds.set(id, {
            keys: keyArray,
            onExecute: options.onExecute || (() => {}),
            onKeyDown: options.onKeyDown || (() => {}),
            onKeyUp: options.onKeyUp || (() => {}),
            holdToExecute: options.holdToExecute || false,
            holdDelay: options.holdDelay || 0,
            preventDefault: options.preventDefault !== false,
            allowInInput: options.allowInInput || false,
            lastHoldExecute: 0
        });

        return id;
    }

    /**
     * Unregister a keybind by its ID
     * @param {string} id - The keybind identifier
     */
    unregister(id) {
        this.keybinds.delete(id);
        this.activeHoldKeybinds.delete(id);
    }

    /**
     * Normalize a key string to a consistent format
     * @param {string} key - The key to normalize
     * @returns {string} Normalized key string
     */
    normalizeKey(key) {
        const parts = key.toLowerCase().split("+");
        const normalized = parts.map(part => {
            switch (part) {
                case "ctrl":
                    return "control";
                case "cmd":
                case "super":
                    return "meta";
                case "alt":
                case "option":
                    return "alt";
                default:
                    return part;
            }
        });
        return normalized.sort().join("+");
    }

    /**
     * Get the current key string based on pressed keys
     * @returns {string} Current key combination string
     */
    getCurrentKeyString() {
        const modifiers = ["control", "alt", "shift", "meta"];
        const pressed = Array.from(this.pressedKeys);
        const mods = pressed.filter(key => modifiers.includes(key));
        const others = pressed.filter(key => !modifiers.includes(key));
        return [...mods, ...others].sort().join("+");
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keydown event
     */
    handleKeyDown(event) {
        // Skip if target is an input element and keybind doesn't allow it
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement
        ) {
            const currentBinding = Array.from(this.keybinds.values())
                .find(binding => !binding.allowInInput);
            if (currentBinding) return;
        }

        const key = this.normalizeKey(event.key);
        this.pressedKeys.add(key);

        const currentKeys = this.getCurrentKeyString();

        for (const [id, binding] of this.keybinds) {
            const matchesKeys = binding.keys.some(k => k === currentKeys);

            if (matchesKeys) {
                if (binding.preventDefault) {
                    event.preventDefault();
                }

                binding.onKeyDown(event);

                if (binding.holdToExecute) {
                    this.activeHoldKeybinds.add(id);
                    this.executeHoldKeybind(id);
                } else {
                    binding.onExecute(event);
                }
            }
        }
    }

    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - The keyup event
     */
    handleKeyUp(event) {
        const key = this.normalizeKey(event.key);
        this.pressedKeys.delete(key);

        const currentKeys = this.getCurrentKeyString();

        for (const [id, binding] of this.keybinds) {
            const matchesKeys = binding.keys.some(k => k === currentKeys);

            if (this.activeHoldKeybinds.has(id)) {
                binding.onKeyUp(event);
                this.activeHoldKeybinds.delete(id);
            }

            if (matchesKeys && binding.preventDefault) {
                event.preventDefault();
            }
        }
    }

    /**
     * Execute a hold keybind with proper timing
     * @param {string} id - The keybind identifier
     */
    executeHoldKeybind(id) {
        const binding = this.keybinds.get(id);
        if (!binding || !this.activeHoldKeybinds.has(id)) return;

        const now = Date.now();
        if (now - binding.lastHoldExecute >= binding.holdDelay) {
            binding.onExecute();
            binding.lastHoldExecute = now;
        }

        requestAnimationFrame(() => this.executeHoldKeybind(id));
    }
}

export default KeybindManager;
