import {Component} from 'complay';

export default class Bar extends Component {
    initialize(options) {
        // console.log(`${this}.initialize()`, this.viewModel, this.model);
        this.ctx = this.el.getContext('2d');
    }

    update() {
        // console.log(this.model.uid, this.model.data.name,this.model.data.percent);
        this.viewModel.data.height = Math.ceil(this.model.data.percent / 100 * this.viewModel.data.maxHeight);
    }

    render() {

        let viewModel = this.viewModel.data;

        // console.log(`${this}.render()`, viewModel.height);

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