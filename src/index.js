/**
 * Import dependencies
 */
import Templar from './templar';

/**
 * Factory function for creating
 * `Templar` instances
 *
 * @param {String} tpl
 * @param {Object} data (optional)
 * @return {Templar}
 * @api public
 */
export default function templar(tpl, data) {
    return new Templar(tpl, data);
}
