import {
  PanelPlugin,
  EventSystemAdapter,
  StyleSystemAdapter
} from '../../DTCD-SDK/index';

import { version } from './../package.json';

import Panel from './components/Panel.vue';

export class EventSystemPanel extends PanelPlugin {
  #guid;
  #component
  #eventSystem;
  #styleSystem;

  static getRegistrationMeta() {
    return {
      version,
      type: 'panel',
      name: 'EventSystemPanel',
      title: 'Панель системы событий и действий',
      withDependencies: true
    };
  }

  constructor(guid, selector) {
    super();
    this.#guid = guid
    this.#eventSystem = new EventSystemAdapter('0.4.0', guid);
    this.#eventSystem.registerPluginInstance(this);
    this.#styleSystem = new StyleSystemAdapter('0.4.0');

    const VueJS = this.getDependence('Vue');
    this.#component = new VueJS.default({
      data: () => {
        return {
          eventSystem: this.#eventSystem,
          styleSystem: this.#styleSystem,
          pluginInstance: this,
          guid
        }
      },
      render: h => h(Panel),
    }).$mount(selector);

    this.render()
  }

  render() {
  }
}
