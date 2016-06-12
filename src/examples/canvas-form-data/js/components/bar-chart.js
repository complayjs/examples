import {Component} from 'complay';
import Model from 'complay/lib/model';
import AnimationLoop from 'complay/extensions/events/animation-loop';
import mix from 'complay/helpers/object/mix'
import Bar from './bar';

export default class BarChart extends mix(Component).with(AnimationLoop) {
    initialize() {
        // console.log(`${this}.initialize()`, this.app, this.el.parentElement);
        this.height = Math.floor(window.innerHeight / 3);
        this.width  = this.el.parentElement.clientWidth;
        this.el.height = this.height;
        this.el.width  = this.width;

        this.context = this.el.getContext('2d');
        this.bars = [];

        this.updateCallback = this.update.bind(this);
        this.renderCallback = this.render.bind(this);

        this.animationUpdateStack.push(this.updateCallback);
        this.animationRenderStack.push(this.renderCallback);

        this.setInitialState();
        this.startCycle();
    }

    setInitialState() {
        this.service.models.forEach(model => {
            // console.log(model.data);
            // not the ideal place for that
            let domItem = this.app.voteForm.items[`${model.data.name}Input`];
            let voteFormRect = this.app.voteForm.el.getBoundingClientRect();

            let rect = domItem.getBoundingClientRect();
            let maxWidth = Math.floor(rect.right - rect.left);
            let maxHeight = this.height;
            let left = Math.ceil(rect.left - voteFormRect.left);

            let viewModel = new Model({
                data: {
                    barHeight: 10,
                    color: 'lightblue',
                    left: left,
                    height: Math.ceil(model.data.percent / 100 * this.height),
                    width: Math.floor(maxWidth / 5),
                    maxHeight,
                    maxWidth
                }
            });

            this.bars.push(new Bar({
                el: this.el,
                model,
                viewModel
            }));
        });
    }

    update() {
        this.bars.forEach(bar => {
            bar.update();
        });
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.bars.forEach(bar => {
            bar.render();
        });
    }
}