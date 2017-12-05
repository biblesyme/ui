import Ember from 'ember';

var validateStageName = function(stages, stage) {
  for (var i = 0; i < stages.length; i++) {
    var item = stages[i];
    if (item.name === stage.name) {
      return i;
    }
  }
  return -1;
};

var validateConditions = function(stage){
  if(!stage.expressions){
    stage.conditions = {}
  }
}
export default Ember.Component.extend({
  sortFinishText: null,
  crt: null,
  dragDom: null,
  model: null,
  pipeline: null,
  envvars: null,
  systemVars: null,
  codeMirror: Ember.inject.service(),
  envvarsLoading: true,
  modalService: Ember.inject.service('modal'),
  env: function(){
    var parameters = this.get('pipeline.parameters');
    var env={};
    if (parameters&&parameters.length) {
      for (var i = 0; i < parameters.length; i++) {
        var value = parameters[i].split('=');
        var k = value[0];
        var v = value[1];
        env[k] = v;
      }
    }
    return Object.keys(env).map(ele=>('${' + ele + '}'));
  }.property('pipeline.parameters'),
  envObserver: function(){
    var env = this.get('env');
    var systemVars = this.get('systemVars');
    this.set('envvars',env.concat(systemVars));
  }.observes('env'),
  review: function(){
    return !this.get('editable');
  }.property('editable'),
  init() {
    this._super(...arguments);
    var pipelineStore = this.get('pipelineStore');
    var env = this.get('env');
    pipelineStore.find('envvars', null, {
      url: `${pipelineStore.baseUrl}/envvars`,
      forceReload: true
    }).then((res) => {
      var hintAry = JSON.parse(res).map(ele => ('${' + ele + '}'));
      this.set('envvarsLoading', false);
      this.set('systemVars', hintAry);
      this.set('envvars', hintAry.concat(env));
      this.get('codeMirror').set('hintAry', hintAry);
    });
  },
  actions: {
    dragStart: function(content, e) {
      var dom = e.target
      var crt = dom.cloneNode(true);
      crt.style.position = "fixed";
      crt.style.top = "-100%";
      crt.style.right = "-100%";
      crt.style.filter = "grayscale(1)";
      var stepWrapGhost = crt.getElementsByClassName('steps-wrap')[0]
      stepWrapGhost.style.border = "1px dashed gray";
      dom.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 84, 50);
      dom.style.filter = 'grayscale(1) drop-shadow(5px 5px 5px #ccc)';
      this.dragDom = dom;
      this.crt = crt;
    },
    startHook: function() {

    },
    dragEnd: function() {
      var crt = this.crt
      crt && crt.remove()
      this.dragDom && (this.dragDom.style.filter = "")
    },
    addStage: function() {
      var cb = (stage) => {
        var stages = this.get('pipeline.stages');
        var valid = validateStageName(stages, stage)
        if (valid !== -1) {
          return false;
        }
        validateConditions(stage);
        stages.pushObject(stage);
        return true;
      };
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        mode: 'new',
        pipeline: this.get('pipeline'),
        cb: cb
      })
    },
    editStage: function(index) {
      var review = !this.get('editable');
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        stage: this.get('pipeline.stages')[index],
        pipeline: this.get('pipeline'),
        mode: review ? 'review' : 'edit',
        cb: (stage) => {
          var stages = this.get('pipeline.stages');
          var valid = validateStageName(stages, stage);
          if (valid !== -1 && valid !== index) {
            return false;
          }
          var newStage = stages.map((ele, i) => {
            if (i === index) {
              return stage;
            }
            return ele;
          })
          validateConditions(stage);
          this.set('pipeline.stages', newStage);
          return true;
        },
        rmCb: () => {
          var newStage = this.get('pipeline.stages').filter((ele, i) => {
            if (i === index) {
              return false;
            }
            return true;
          });
          this.set('pipeline.stages', newStage);
        }
      })
    }
  },
  didInsertElement() {
    this._super(...arguments);
    this.$(document).on('keyup', 'input:not(.js-disable-hint)', (e) => {
      $.fn.E_INPUT_HINT.startHint(e.target, ( /*hint*/ ) => {});
    })
  }
});
