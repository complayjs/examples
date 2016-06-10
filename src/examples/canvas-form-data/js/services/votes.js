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
            model.on('change:count', this.onModelCountChange.bind(this, model));
        });
    }

    onModelCountChange(data) {
        // console.log(`${this}.onModelCountChange()`, data.val, data.oldVal);
        this.setPercentage();
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
            // console.log(sum, model.data.count, Math.floor(model.data.count / sum * 100));
            model.data.percent = sum && Math.floor(model.data.count / sum * 100) || 0;
        });
    }
}