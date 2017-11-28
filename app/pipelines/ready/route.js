import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  queryParams: {
    forceLoad: {
      refreshModel: true
    },
  },
  model: function() {
    var pipeline = this.get('pipeline');
    if(!pipeline.ready||!pipeline.ready.ready){
      return []
    }
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('pipeline');
    return model
  },
  afterModel: function(model, transition) {
    var params = transition.queryParams;
    if(params.forceLoad === 'true'){
      return
    }
    // skip to pipelines page when there is no pipeline
    if (!model.content.length) {
      this.get('router').transitionTo('pipelines.ready.pipelines');
    }
  },
});
