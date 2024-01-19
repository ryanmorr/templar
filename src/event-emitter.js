export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(name, callback) {
        let callbacks = this.events.get(name);
        if (!callbacks) {
            callbacks = [];
            this.events.set(name, callbacks);
        }
        callbacks.push(callback);
    }

    remove(name, callback) {
        const callbacks = this.events.get(name);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(name, ...args) {
        const callbacks = this.events.get(name);
        if (callbacks && callbacks.length) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
}
