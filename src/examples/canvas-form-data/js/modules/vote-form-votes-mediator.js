import {Module} from 'complay';
import TwoWayDataBind from 'complay/extensions/data/two-way-data-bind';

export default class VoteFormVotesMediator extends Module {
    initialize(options) {

        this.votes = options.votes;
        this.voteForm = options.voteForm;
        this.barChart = options.barChart;

        this.twoWayDataBind = new TwoWayDataBind();

        this.dataBind();
    }

    bindCustomEvents() {
        this.voteForm.on('vote', this.onVote.bind(this));
    }

    onVote(data) {
        let model = this.votes.data.where({name: data.selected});

        if (model.length) {
            model[0].data.count++;
        }
    }

    dataBind() {

        this.votes.models.forEach((model, key) => {
            let domItem = this.voteForm.items[`${model.data.name}Input`];

            if (domItem) {
                this.twoWayDataBind.sync({
                    sourceObj: model._storage,
                    sourceKey: '__count',
                    bindObj: domItem,
                    bindKey: 'value'
                });
            }
        });
    }
}