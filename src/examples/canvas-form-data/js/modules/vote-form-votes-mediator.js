import {Module} from '../../../../complay/js/complay';
import TwoWayDataBind from '../../../../complay/js/extensions/data/two-way-data-bind';

export default class VoteFormVotesMediator extends Module {
    initialize(options) {

        this.voteForm = options.voteForm;
        this.votes = options.votes;

        this.twoWayDataBind = new TwoWayDataBind();

        this.dataBind();
    }

    bindCustomEvents() {
        this.voteForm.on('vote', this.onVote.bind(this));
    }

    onVote(data) {
        let model = this.votes.data.where({name: data.selected})

        if (model.length) {
            model[0].count++;
        }
    }

    dataBind() {

        this.votes.toArray().forEach((model) => {
            let domItem = this.voteForm.items[`${model.name}Input`];
            if (domItem) {
                this.twoWayDataBind.sync({
                    sourceObj: model,
                    sourceKey: 'count',
                    bindObj: domItem,
                    bindKey: 'value'
                });
            }
        });
    }
}