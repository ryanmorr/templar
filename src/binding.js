import { scheduleRender } from '@ryanmorr/schedule-render';

export default class Binding {
    constructor(tpl) {
        this.tpl = tpl;
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
