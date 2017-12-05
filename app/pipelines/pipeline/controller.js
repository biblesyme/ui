import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mode'],
  mode:'',
  stages: function() {
    var pipeline = this.get('model.pipeline');
    return pipeline.stages
  }.property('model'),
  errors: null,
  filteredPiplineHistory: function(){
    debugger
    let pipelineHistory = this.get('model.pipelineHistory');
    let pipeline = this.get('model.pipeline');
    if(!pipelineHistory){
      return;
    }
    let filteredPiplineHistory = pipelineHistory.filter(ele=>ele.pipelineSource.id === pipeline.id);
    return filteredPiplineHistory;
  }.property('pipelineHistory'),
  editable: function(){
    let mode = this.get('mode');
    return (mode !== 'review');
  }.property('mode'),
  actions: {
    save: function(success) {
      var model = this.get('model');
      var errors = model.pipeline.validationErrors();
      if (errors.length > 0) {
        this.set('errors', errors)
        success(false)
        return
      }
      var mode = this.get('mode');
      (function(){
        if(mode==='duplicate'){
          return model.pipeline.save()
        }
        return model.pipeline.doAction('update', model.pipeline.serialize())
      })()
      .then(() => {
        success(true)
        this.set('errors',null);
        this.transitionToRoute('pipelines.ready.pipelines')
      }).finally(()=>{
        success(false)
      })
    },
    cancel: function() {
      this.set('errors',null);
      this.transitionToRoute('pipelines.ready.pipelines')
    }
  }
});
