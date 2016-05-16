import {Component} from '../../../../complay/complay';
import mix from '../../../../complay/helpers/object/mix'
import ItemSelectorToMembers from '../../../../complay/extensions/components/item-selector-to-members';

export default class VoteForm extends mix(Component).with(ItemSelectorToMembers) {
    initialize() {
        // console.log(this.el, this.items, this.app.votes);
    }

    bindEvents() {
        this.events['click [data-js-item="vote-button"]'] = this.onVoteButtonClick;
    }

    onVoteButtonClick(evt) {
        // console.log(`${this}.onVoteButtonClick(${evt})` );

        if (this.el.language && this.el.language.value) {
            this.trigger('vote', {selected: this.el.language.value});
            Array.from(this.el.language).forEach(radio => radio.checked = false);
        }
    }
}