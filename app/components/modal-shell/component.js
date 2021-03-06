import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, {
  classNames: ['modal-container', 'large-modal', 'modal-shell'],
  originalModel: Ember.computed.alias('modalService.modalOpts.model'),
  init() {
    this._super(...arguments);
    this.shortcuts.disable();
  },
  willDestroy() {
    this._super(...arguments);
    this.shortcuts.enable();
  }

});
