import templar from '../../src';

describe('events', () => {
    it('should add an event', (done) => {
        const tpl = templar('<div onclick="{{click}}"></div>');
        const div = tpl.query('div')[0];
        const evt = new MouseEvent('click');

        const onClick = sinon.spy((e) => {
            expect(e).to.equal(evt);
            done();
        });

        tpl.set('click', onClick);

        div.dispatchEvent(evt);
    });

    it('should remove an event if the value is null', (done) => {
        const tpl = templar('<div onclick="{{click}}"></div>');
        const div = tpl.query('div')[0];
        const removeEventSpy = sinon.spy(div, 'removeEventListener');
        const evt = new MouseEvent('click');

        const onClick = sinon.spy(() => {
            tpl.set('click', null);
            expect(removeEventSpy.called).to.equal(true);
            expect(removeEventSpy.calledWith('click', onClick)).to.equal(true);
            removeEventSpy.restore();
            done();
        });

        tpl.set('click', onClick);

        div.dispatchEvent(evt);
    });
});
