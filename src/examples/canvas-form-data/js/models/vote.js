import Model from 'complay/lib/model';

export default class Vote extends Model {

    initialize() {
        // console.log(`${this}.initialize()`);
        this.add('percent');
    }

    validateCount() {
        // console.log(`${this}.validateCount()`);
        return true;
    }

    validatePercent() {
        // console.log(`${this}.validatePercent()`);
        return true;
    }
}