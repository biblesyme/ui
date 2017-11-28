import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status', 'sortBy', 'descending'],
  status: 'all',
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
    let out = this.get('model')
      .filter(ele => {
        if (ele.status === 'Pending') {
          return false
        }
        if (status === 'all') {
          return true
        }
        if (status === "running" &&
          ele.status !== 'Success' &&
          ele.status !== 'Fail' &&
          ele.status !== 'Denied' &&
          ele.status !== 'Abort') {
          return true
        }
        if (status === 'fail' &&
          ele.status === 'Denied') {
          return true
        }
        return ele.status === status
      });
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
