import templar from '../../src/templar';

describe('rendering', () => {
    it('should not schedule a frame if the template has been mounted to a parent element but not rendered within the DOM', () => {
        const tpl = templar('<div>{{foo}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        const root = document.createElement('div');

        tpl.mount(root);
        tpl.set('foo', 'aaa');

        expect(spy.called).to.equal(false);
        expect(root.querySelector('div').textContent).to.equal('aaa');

        spy.restore();
    });

    it('should schedule a frame to update the template if it is rendered within the DOM', (done) => {
        const tpl = templar('<div id="{{foo}}">{{bar}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');

        const root = document.createElement('div');
        document.body.appendChild(root);

        tpl.mount(root);
        tpl.set('foo', 'abc');
        expect(spy.callCount).to.equal(1);

        requestAnimationFrame(() => {
            expect(root.innerHTML).to.equal('<div id="abc"></div>');
            
            tpl.set('bar', 123);
            expect(spy.callCount).to.equal(3);
            requestAnimationFrame(() => {
                expect(root.innerHTML).to.equal('<div id="abc">123</div>');

                document.body.removeChild(root);
                spy.restore();
                done();
            });
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const tpl = templar('<div id="{{foo}}">{{bar}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');

        const root = document.createElement('div');
        document.body.appendChild(root);

        tpl.mount(root);
        tpl.set('foo', 'abc');
        expect(spy.callCount).to.equal(1);

        tpl.set('bar', 123);
        expect(spy.callCount).to.equal(1);

        requestAnimationFrame(() => {
            expect(root.innerHTML).to.equal('<div id="abc">123</div>');

            document.body.removeChild(root);
            spy.restore();
            done();
        });
    });
});
