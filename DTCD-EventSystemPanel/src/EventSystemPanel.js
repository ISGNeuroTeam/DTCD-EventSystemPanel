import {
  PanelPlugin,
  EventSystemAdapter,
  StyleSystemAdapter
} from '../../DTCD-SDK/index';

import Panel from "./components/Panel.vue"

export class EventSystemPanel extends PanelPlugin {
  #guid;
  #component
  #eventSystem;
  #styleSystem;

  static getRegistrationMeta() {
    return {
      type: 'panel',
      name: 'EventSystemPanel',
      title: 'Панель системы событий и действий',
      version: '0.1.0',
      withDependencies:true
    };
  }

  constructor(guid, selector) {
    super();
    this.#guid = guid
    this.#eventSystem = new EventSystemAdapter(guid);
    this.#eventSystem.registerPluginInstance(this);
    this.#styleSystem = new StyleSystemAdapter();

    this.#styleSystem.setVariablesToElement(document.querySelector(selector).parentElement, this.#styleSystem.getCurrentTheme());

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
