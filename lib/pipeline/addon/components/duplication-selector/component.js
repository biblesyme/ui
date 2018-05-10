import Component from '@ember/component';
import layout from './template';
import { on } from '@ember/object/evented';
import { get, set, observer } from '@ember/object';


export default Component.extend({
  layout,
  selectorType: 'workload',//'workload',ingress,catalog
  selecting: false,
  actions: {
    setState(key, val){
      set(this, key, val);
    }
  }
});
