import MenuPanelComponent from './ConfigEditorPanel.vue';

import {
  PanelPlugin,
  EventSystemAdapter,
  StyleSystemAdapter,
  WorkspaceSystemAdapter,
  DataSourceSystemAdapter,
} from '../../DTCD-SDK/index';

export class ConfigEditorPanel extends PanelPlugin {
  static getRegistrationMeta() {
    return {
      type: 'panel',
      name: 'ConfigEditorPanel',
      title: 'Панель конфигурации',
      version: '0.1.0',
      withDependencies: true,
    };
  }
  #guid;
  #watchingMode;
  #vueComponent;

  constructor(guid, selector) {
    super();
    this.#guid = guid;
    this.#watchingMode = true;
    this.currentSettingsConfig = {};
    const eventSystem = new EventSystemAdapter(guid);
    eventSystem.registerPluginInstance(this);
    const styleSystem = new StyleSystemAdapter();
    const workspaceSystem = new WorkspaceSystemAdapter();
    const dataSourceSystem = new DataSourceSystemAdapter();

    eventSystem.subscribe(
      this.getGUID(this.getSystem('WorkspaceSystem')),
      'WorkspaceCellClicked',
      guid,
      'createConfigForm'
    );

    const VueJS = this.getDependence('Vue').default;
    const vueRootComponent = new VueJS({
      data: () => {
        return {
          guid,
          eventSystem,
          styleSystem,
          workspaceSystem,
          dataSourceSystem,
          pluginInstance: this,
        };
      },
      render: h => h(MenuPanelComponent),
    }).$mount(selector);
    this.#vueComponent = vueRootComponent.$children[0];
  }

  setWatchingMode(val) {
    this.#watchingMode = val;
  }

  createConfigForm(evt) {
    if (this.#watchingMode && this.#guid !== evt.guid) {
      const instance = this.getInstance(evt.guid);
      this.#vueComponent.render(instance.getFormSettings());
    }
  }
}
