import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
  actions: {
    showLogsActivity: function(model,stageIndex,stepIndex){
      model.set('stageIndex',stageIndex);
      model.set('stepIndex',stepIndex);
    },
  }
});
