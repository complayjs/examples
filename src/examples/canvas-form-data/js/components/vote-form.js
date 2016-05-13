import {Component} from '../../../../complay/js/complay';
import mix from '../../../../complay/js/helpers/object/mix'
import ItemSelectorToMembers from '../../../../complay/js/extensions/components/item-selector-to-members';

export default class VoteForm extends mix(Component).with(ItemSelectorToMembers) {
    initialize() {
        console.log(this.el, this.items);
    }
}