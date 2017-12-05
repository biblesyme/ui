import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['sortBy', 'descending'],
  sortBy: 'start_ts',
  descending: true,
  modalService: Ember.inject.service('modal'),
  waitingForApproval: function() {
    let out = this.get('model')
      .filter(ele => {
        if (ele.status === 'Pending') {
          return true
        }
        return false
      });
    return out;
  }.property('model.@each.status', 'status'),
  filtered: function() {
    var status = this.get('status');
    let out = this.get('model');
    return out;
  }.property('model.@each.status', 'status'),
  actions: {
    runPipelines: function() {
      this.get('modalService').toggleModal('modal-pipeline-run', {
        cb: () => {}
      });
    },
    sendAction: function(model, action) {
      return model.send(action)
    },
  }
});
