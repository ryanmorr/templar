export default class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(name, callback) {
        let callbacks = this.events[name];
        if (callbacks === undefined) {
            callbacks = [];
            this.events[name] = callbacks;
        }
        callbacks.push(callback);
    }

    remove(name, callback) {
        const callbacks = this.events[name];
        if (callbacks !== undefined) {
            for (let i = 0, len = callbacks.length; i < len; i++) {
                if (callbacks[i] === callback) {
                    callbacks.splice(i, 1);
                    return;
                }
            }
        }
    }

    emit(name, ...args) {
        const callbacks = this.events[name];
        if (callbacks !== undefined && callbacks.length) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
}
