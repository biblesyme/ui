import Ember from 'ember';

export default Ember.Component.extend({
  repos:[],
  pipelineSvc: Ember.inject.service('pipeline'),
  selected: null,
  selectedGitUser: null,
  statusFetching: true,
  repoFetching: false,
  repoRefresh: false,
  setting: null,
  showBranch: function(){
    var modalOpts = this.get('modalOpts');
    var setting = this.get('setting');

    if(modalOpts.type === 'review'){
      return true;
    }
    if(setting&&setting.find(ele => ele.isAuth)){
      return true;
    }
    return false;
  }.property('setting', 'modalOpts.type'),
  accountsInfo: function(){
    var accounts = this.get('modalOpts.accounts');
    if(!accounts){
      return [];
    }
    return accounts
  }.property('modalOpts.accounts'),
  init(){
    this._super(...arguments);
    var modalOpts = this.get('modalOpts');
    var selectedModel = this.get('selectedModel');
    var accountsInfo = this.get('accountsInfo');
    if(modalOpts.type !== 'review'){
      this.set('statusFetching',true);
      setTimeout(()=>{
        if(selectedModel.gitUser){
          var selectedGitUser = accountsInfo.find(ele=>ele.id===selectedModel.gitUser);
          selectedGitUser&&this.set('selectedGitUser',selectedGitUser);
        }
        this.loadSetting((res)=>{
          this.set('setting',res);
          this.set('statusFetching',false);
        });
      },0);
    }else{
      this.set('statusFetching',false);
    }
  },
  selectedGitUserObserve: function(){
    var selectedGitUser = this.get('selectedGitUser');
    this.set('pipelineSvc.selectedGitUser',selectedGitUser);
    this.set('selectedModel.gitUser', selectedGitUser.id);
    this.set('repoFetching',true);
    selectedGitUser.followLink('repos').then(res=>{
      this.set('statusFetching',false);
      var repos = res;
      this.set('repos',repos);
      this.syncRepository();
    }).finally(()=>{
      this.set('repoFetching',false);
    });
  }.observes('selectedGitUser'),
  loadSetting(fn1,fn2){
    var pipelineStore = this.get('pipelineStore');
    return pipelineStore.find('scmSetting',null, {forceReload: true}).then((res)=>{
      fn1&&fn1(res);
      if(res.isAuth){
        return null
      }else{
        return null
      }
    }).then(fn2)
  },
  syncRepository(){
    var selectedModel = this.get('selectedModel');
    var repos = this.get('repos',repos);
    if(selectedModel.repository){
      var selected = repos.find((ele)=>{
        if(ele.clone_url === selectedModel.repository){
          return true;
        }
        return false;
      })
      selected&&this.set('selected', selected)||this.set('selected',null)
    }
  },
  selectedObserves: function(){
    var selected = this.get('selected');

    if(!selected){
      this.set('selectedModel.repository', '');
      return
    }

    this.set('selectedModel.repository', selected.clone_url);
    if(!selected.permissions.admin){
      this.set('selectedModel.webhook', false);
    }else{
      this.set('selectedModel.webhook', true);
    }
  }.observes('selected','selectedModel.sourceType'),
  sourceTypeObserves: function(){
    this.syncRepository();
  }.observes('selectedModel.sourceType'),
  actions: {
    reloadRepo: function(){
      var selectedGitUser = this.get('selectedGitUser');
      if(!selectedGitUser){
        return
      }
      this.set('repoRefresh', true);
      this.set('repoFetching',true);
      selectedGitUser.doAction('refreshrepos').then((res)=>{
        this.set('repos',res);
        this.syncRepository();
      }).finally(()=>{
        this.set('repoRefresh', false);
        this.set('repoFetching',false);
      });
    },
    changeSCMType: function(type){
      this.set('selectedModel.sourceType',type);
    },
    reload: function(){
      this.loadSetting((res)=>{
        this.set('setting',res);
      });
    }
  }
});
