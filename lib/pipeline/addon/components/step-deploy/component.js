import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import layout from './template';
import { set, get, computed } from '@ember/object';

const strategyChoices = [{
    id: 'upgrade-image',
    name: 'upgrade image'
  },{
    id: 'apply-workload',
    name: 'apply rancher workload'
  },{
    id: 'apply-ingress',
    name: 'apply rancher ingress'
  },{
    id: 'apply-catalog',
    name: 'apply rancher catalog'
  },{
    id: 'apply-yaml',
    name: 'apply kubernetes yaml'
  },
];

export default Component.extend({
  layout,
  strategyChoices,
  strategyComponent: computed('type', function() {
    let type = get(this, 'type');
    return `step-deploy-${type}`;
  }),
  type: 'apply-yaml',
  registries: null,
  publishImageConfig: alias('selectedModel.publishImageConfig'),
});
