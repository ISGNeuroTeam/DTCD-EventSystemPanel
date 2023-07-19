import {
  PanelPlugin,
  EventSystemAdapter,
  StyleSystemAdapter,
  LogSystemAdapter,
  NotificationSystemAdapter,
} from '../../DTCD-SDK/index';

import { version } from './../package.json';

import Panel from './components/Panel.vue';

export class EventSystemPanel extends PanelPlugin {
  #guid;
  #vueComponent;
  #eventSystem;
  #styleSystem;

  #config = {
    isTitleVisible: true,
  };

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
    this.#guid = guid;
    this.#eventSystem = new EventSystemAdapter('0.4.0', guid);
    this.#styleSystem = new StyleSystemAdapter('0.4.0');
    const logSystem = new LogSystemAdapter('0.7.0', guid, EventSystemPanel.getRegistrationMeta().name);
    const notificationSystem = new NotificationSystemAdapter('0.1.1');
    const { default: VueJS } = this.getDependence('Vue');
    const view = new VueJS({
      data: () => {
        return {
          guid,
          logSystem,
          notificationSystem,
          eventSystem: this.#eventSystem,
          styleSystem: this.#styleSystem,
          pluginInstance: this,
          typeVisibleWindow: 'Main',
          indexActiveTab: 0,
          actionFormData: {
            name: '',
            nameNewParam: '',
            parameters: [],
            body: '',
          },
          subscriptionFormData: {
            subscriptionName: '',
            chosenPanel: '',
            chosenEvent: '',
            chosenArg: '',
            chosenPanelWithActions: '',
            chosenAction: '',
          },
        };
      },
      render: h => h(Panel),
    }).$mount(selector);

    this.#vueComponent = view.$children[0];
  }

  setVueComponentPropValue(prop, value) {
    const methodName = `set${prop.charAt(0).toUpperCase() + prop.slice(1)}`;
    if (this.#vueComponent[methodName]) {
      this.#vueComponent[methodName](value)
    } else {
      throw new Error(`В компоненте отсутствует метод ${methodName} для присвоения свойства ${prop}`)
    }
  }

  setPluginConfig(config = {}) {
    const configProps = Object.keys(this.#config);

    for (const [prop, value] of Object.entries(config)) {
      if (!configProps.includes(prop)) continue;
      this.setVueComponentPropValue(prop, value)

      this.#config[prop] = value;
    }
  }

  getPluginConfig() {
    return { ...this.#config };
  }

  setFormSettings(config) {
    return this.setPluginConfig(config);
  }

  getFormSettings() {
    return {
      fields: [
        {
          component: 'title',
          propValue: 'Общие настройки',
        },
        {
          component: 'switch',
          propName: 'isTitleVisible',
          attrs: {
            label: 'Скрыть/отобразить название панели',
          },
        },
      ],
    };
  }

  getState() {
    return {
      typeVisibleWindow: this.#vueComponent.typeVisibleWindow,
      indexActiveTab: this.#vueComponent.indexActiveTab,
      actionFormData: this.#vueComponent.actionFormData,
      subscriptionFormData: this.#vueComponent.subscriptionFormData,
    };
  }

  setState(newState) {
    if (typeof newState !== 'object' ) return;

    const vueNamesFields = [
      'typeVisibleWindow',
      'indexActiveTab',
      'actionFormData',
      'subscriptionFormData',
    ];

    for (const [prop, value] of Object.entries(newState)) {
      if (!vueNamesFields.includes(prop)) continue;
      this.#vueComponent[prop] = value;
    }
  }
}
