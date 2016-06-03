import {Component} from 'complay';

export default class Bar extends Component {
    initialize(options) {
        console.log(`${this}.initialize()`, this.viewModel, this.model);
        this.ctx = this.el.getContext('2d');
    }

    update() {}

    render() {

        let viewModel = this.viewModel.data;

        this.ctx.save();
        this.ctx.fillStyle = viewModel.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 3;
        this.ctx.shadowColor = viewModel.color;
        this.ctx.fillRect(
            viewModel.left,
            Math.floor(viewModel.maxHeight - viewModel.height),
            viewModel.width,
            viewModel.height);

        this.ctx.restore();
    }
}