import Service from 'complay/lib/service';
import Vote from '../models/vote'

export default class Votes extends Service {
    get Model() {
        return Vote;
    }

    initialize() {
        this.setPercentage();
    }

    bindCustomEvents() {
        // console.log(`${this}.bindCustomEvents()`, this.models);
        this.models.forEach(model => {
            model.on('change', this.onModelChange.bind(this));
        });
    }

    onModelChange(key, val, oldVal) {
        console.log(`${this}.onModelChange()`);
        switch(key) {
            case('count'): {
                this.setPercentage();
                break;
            }
        }
    }

    getCountSum() {
        let sum = 0;

        this.toArray().forEach(model => {

            let count = model.data.count;
            sum += count;
        });

        return sum;
    }

    setPercentage() {

        let sum = this.getCountSum();

        this.toArray().forEach(model => {
            model.data.percent = sum && (model.data.count / sum * 100);
        });
    }
}