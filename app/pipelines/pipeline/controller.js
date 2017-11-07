import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mode'],
  mode:'',
  stages: function() {
    var pipeline = this.get('model.pipeline');
    return pipeline.stages
  }.property('model'),
  errors: null,
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
