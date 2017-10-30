import Ember from 'ember';
import C from 'ui/utils/constants';

const DEFAULT_ROUTE = 'pipelines.ready.activities';
const VALID_ROUTES = [DEFAULT_ROUTE,'scaling-groups','balancers', 'dns','volumes'];

export default Ember.Route.extend({
  redirect() {
    let route = 'pipelines.ready.activities';
    if ( !VALID_ROUTES.includes(route) ) {
      route = DEFAULT_ROUTE;
    }

    this.replaceWith(route);
  },
});
