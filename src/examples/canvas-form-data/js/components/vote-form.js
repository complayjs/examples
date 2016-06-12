import {Component} from 'complay';
import mix from 'complay/helpers/object/mix'
import ItemSelectorToMembers from 'complay/extensions/component/item-selector-to-members';

export default class VoteForm extends mix(Component).with(ItemSelectorToMembers) {
    initialize() {
        // console.log(this.el, this.items, this.app.votes);
    }

    bindEvents() {
        this.events['click [data-js-item="vote-button"]'] = this.onVoteButtonClick;
    }

    onVoteButtonClick(evt) {
        // console.log(`${this}.onVoteButtonClick(${evt})`, this.el.language, this.el.language.value);

        let selectedLanguage;

        for (let i = 0; i < this.el.language.length; i++) {
            if (this.el.language[i].checked === true) {
                selectedLanguage = this.el.language[i].value;
            }
        }

        if (selectedLanguage) {
            this.trigger('vote', {selected: selectedLanguage});
            Array.from(this.el.language).forEach(radio => radio.checked = false);
        }
    }
}