import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function() {
    var pipeline = this.get('pipeline');
    if(!pipeline.ready||!pipeline.ready.ready){
      return []
    }
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('activity');
    return model
  },
  afterModel: function(model) {
    if (!model.content.length) {
      this.get('router').transitionTo('pipelines.ready.pipelines');
    }else{
      this.get('router').transitionTo('pipelines.ready.activities');
    }
  },
});
