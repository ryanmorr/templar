import { scheduleRender } from '@ryanmorr/schedule-render';

export default class Binding {
    constructor(tpl, text) {
        this.tpl = tpl;
        this.text = text;
    }

    setTokens(tokens) {
        this.tokens = tokens;
    }

    shouldUpdate() {
        return this.tokens.every((token) => token in this.tpl.data);
    }

    update() {
        if (!this.renderer) {
            this.renderer = this.render.bind(this);
            scheduleRender(this.renderer);
        }
    }

    render() {
        this.renderer = null;
    }
}
