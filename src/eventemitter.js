/**
 * Import dependencies
 */
import { hashmap } from './util';

/**
 * Custom event class
 *
 * @class EventEmitter
 * @api private
 */
export default class EventEmitter {
    /**
     * Instantiate the class
     *
     * @constructor
     * @api public
     */
    constructor() {
        this.events = hashmap();
    }

    /**
     * Add a listener for a custom event
     *
     * @param {String} name
     * @param {Function} callback
     * @api public
     */
    on(name, callback) {
        let callbacks = this.events[name];
        if (callbacks === undefined) {
            callbacks = [];
            this.events[name] = callbacks;
        }
        callbacks.push(callback);
    }

    /**
     * Remove a listener from a custom event
     *
     * @param {String} name
     * @param {Function} callback
     * @api public
     */
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

    /**
     * Dispatch a custom event to all its
     * listeners
     *
     * @param {String} name
     * @param {...*} args
     * @api public
     */
    emit(name, ...args) {
        const callbacks = this.events[name];
        if (callbacks !== undefined && callbacks.length) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
}
