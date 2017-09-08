import Ember from 'ember';
import config from './config/environment';
import {applyRoutes, clearRoutes} from 'ui/utils/additional-routes';

const Router = Ember.Router.extend({
  modalService: Ember.inject.service('modal'),
  location: config.locationType,
  willTransition(){
    if (this.get('modalService.modalVisible')) {
      this.get('modalService').toggleModal();
    }
  },
});

Router.map(function() {
  this.route('ie');
  this.route('index');
  this.route('failWhale', {path: '/fail'});
  this.route('not-found', {path: '*path'});

  this.route('signup', {path: '/signup'});
  this.route('verify', {path: '/verify/:verify_token'});
  this.route('verify-reset-password', {path: '/verify-reset-password/:verify_token'});
  this.route('login', function() {
    this.route('index', {path: '/'});
    this.route('shibboleth-auth');
  });
  this.route('logout');

  this.route('authenticated', {path: '/'}, function() {

    this.route('style-guide', {path: '/style-guide'});
    this.route('dummy-dev', {path: '/dev'});

    this.route('user-preferences', {path: '/user-preferences', resetNamespace: true});

    // Settings
    this.route('settings', {resetNamespace: true}, function() {
      this.route('projects', {path: '/env'}, function() {
        this.route('index', {path: '/'});
        this.route('new', {path: '/add'});
        this.route('detail', {path: '/:project_id'});
      });
    });

    // Admin
    this.route('admin-tab', {path: '/admin', resetNamespace: true}, function() {
      this.route('auth', {path: '/access'}, function() {
        this.route('activedirectory');
        this.route('azuread');
        this.route('github');
        this.route('openldap');
        this.route('localauth', {path: 'local'});
        this.route('shibboleth');
      });

      this.route('settings');
      this.route('ha');

      this.route('accounts', {path: '/accounts'}, function() {
        this.route('index', {path: '/'});
        this.route('new', {path: '/add'});
      });

      this.route('processes', {path: '/processes'}, function() {
        this.route('index', {path: '/'});
        this.route('pools', {path: '/pools'});
        this.route('list', {path: '/list'});
      });
      this.route('process', {path: '/processes/:process_id'});

      this.route('audit-logs');
      this.route('machine');
    });

    this.route('project', {path: '/env/:project_id'}, function() {
      this.route('index', {path: '/'});
      this.route('apikeys', {path: '/api/keys'}, function() {
        this.route('account', {path: '/account'});
        this.route('environment', {path: '/environment'});
      });
      this.route('waiting');

      this.route('pipelines', {resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('new-pipeline', {path: '/addPipeline'});
        this.route('ready', {path: '/r'},function(){
          this.route('activities',{path:'/'});
          this.route('pipelines',{path:'/pipelines'});
          this.route('settings',{path:'/settings'});
        });
        this.route('activity', {path: '/activities/:activity_id'});
        
        this.route('pipeline', {path: '/pipelines/:pipeline_id'});
      });
      
      this.route('containers', {resetNamespace: true}, function() {
        this.route('run', {path: '/run'});
        this.route('index', {path: '/'});

        this.route('container', {path: '/:container_id', resetNamespace: true});
      });

      this.route('balancers', {path: '/balancers', resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('run', {path: '/run'});
      });

      this.route('dns', {path: '/dns', resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('new', {path: '/add'});
      });

      this.route('volumes', {path: '/volumes', resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('new', {path: '/add'});

        this.route('volume', {path: '/volume/:volume_id', resetNamespace: true});
      });

      this.route('service', {path: '/services/:scaling_group_id', resetNamespace: true});

      this.route('stack', {path: '/stack/:stack_id', resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('code',  {path: '/code'});
        this.route('graph', {path: '/graph'});
        this.route('chart', {path: '/chart'});
      });

      this.route('new-stack', {path: '/import-compose', resetNamespace: true});

      this.route('custom-host', {path: '/hosts/custom', resetNamespace: true});
      this.route('hosts', {path: '/hosts', resetNamespace: true}, function() {
        this.route('index', {path: '/'});

        this.route('templates', {path: '/launch'}, function() {
          this.route('index', {path: '/'});
          this.route('launch', {path: '/:template_id'});
        });

        this.route('new', {path: '/add'}, function() {
          this.route('index', {path: '/'});
        });

        this.route('host', {path: '/:host_id', resetNamespace: true});
      });

      // Infrastructure
      this.route('infrastructure-tab', {path: '/infra', resetNamespace: true}, function() {
        // Popup Routes
        this.route('console', {path: '/console', resetNamespace: true});
        this.route('container-log', {path: '/container-log', resetNamespace: true});

        this.route('certificates', {resetNamespace: true}, function() {
          this.route('new', {path: '/add'});
          this.route('index', {path: '/'});
          this.route('detail', {path: '/:certificate_id'});
        });

        this.route('registries', {path: '/registries', resetNamespace: true}, function() {
          this.route('new', { path: '/add' });
          this.route('index', {path: '/'});
        });

        this.route('secrets', {path: '/secrets', resetNamespace: true}, function() {
          this.route('new', {path: '/add'});
          this.route('index', {path: '/'});
          this.route('detail', {path: '/:certificate_id'});
        });
      });

      // Catalog
      this.route('apps-tab', {path: '/apps', resetNamespace: true}, function() {
        this.route('index', {path: '/'});

        this.route('catalog-tab', {path: '/catalog', resetNamespace: true}, function() {
          this.route('index', {path: '/'});
          this.route('launch', {path: '/:template'});
        });
      });

      this.route('k8s-tab', {path: '/kubernetes', resetNamespace: true});
      this.route('k8s-import', {path: '/kubernetes-import'});

      this.route('help');

      this.route('apikeys', {path: '/api/keys'}, function() {
        this.route('account', {path: '/account'});
        this.route('environment', {path: '/environment'});
      });

      this.route('hooks', {path: '/api/hooks'}, function() {
        this.route('new-receiver', {path: '/add-receiver'});
        this.route('edit-receiver', {path: '/receiver/:receiver_id'});
      });

      // End: Authenticated
    });
  });


  // Load any custom routes from additional-routes
  var cb = applyRoutes("application");
  if( cb ) {
    cb.apply(this);
  }
  clearRoutes();
});


export default Router;
