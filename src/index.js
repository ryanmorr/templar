import Templar from './templar';

export default function templar(tpl, data) {
    return new Templar(tpl, data);
}
