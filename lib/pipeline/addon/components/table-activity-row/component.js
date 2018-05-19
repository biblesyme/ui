import Component from '@ember/component';
import { set, get } from '@ember/object';

export default Component.extend({
  init(){
    this._super();
    set(this, 'activityLogs', {});
  },
  runningObserves: function(){
    var stages = get(this, 'activity.stages');
    let logModel = get(this, 'logModel');
    var runningStage = stages.findIndex(ele=>ele.state==='Building');
    if(runningStage === -1){
      return
    }
    var runningStep = stages[runningStage].steps.findIndex(ele=>ele.state==='Building');
    if(runningStep === -1) {
      return
    }
    logModel&&logModel.setProperties({
      'stageIndex': runningStage,
      'stepIndex': runningStep
    });
  }.observes('activity.stages.@each.stepStates'),
  logModel: function(){
    return get(this, 'logStatus')[get(this, 'index')];
  }.property('logStatus.@each.{stageIndex,stepIndex,activityLogs}','index'),
  actions: {
    showLogsActivity: function(model,stageIndex,stepIndex){
      get(this, 'logModel').setProperties({
        'stageIndex': stageIndex,
        'stepIndex': stepIndex
      });
    },
  }
});
