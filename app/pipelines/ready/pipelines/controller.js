import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['sortBy', 'descending'],
  sortBy: 'Name',
  filtered: function() {
    var status = this.get('status');
    let out = this.get('model')
    return out;
  }.property('model.@each.isActivate'),
});
