import {
  PanelPlugin,
  EventSystemAdapter,
  StyleSystemAdapter,
  LogSystemAdapter,
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
    this.#styleSystem = new StyleSystemAdapter('0.4.0');
    const logSystem = new LogSystemAdapter('0.7.0', guid, EventSystemPanel.getRegistrationMeta().name);

    const VueJS = this.getDependence('Vue');
    this.#component = new VueJS.default({
      data: () => {
        return {
          eventSystem: this.#eventSystem,
          styleSystem: this.#styleSystem,
          logSystem,
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
