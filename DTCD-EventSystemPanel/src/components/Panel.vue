<template>
  <div class="EventSystemPanel">
    <div
      class="Wrapper"
      v-if="typeVisibleWindow === 'Main'"
    >
      <div class="Header">
        <base-heading theme="theme_subheaderSmall">
          <h4>EventSystemPanel</h4>
        </base-heading>
      </div>

      <div class="Body">
        <base-tabs>
          <div slot="tab" tab-name="Активные подписки">
            <div class="TabTopBtnWrapper">
              <base-button
                theme="theme_blueSec"
                size="big"
                width="full"
                @click="toggleWindow('Subscription_Form')"
              >Добавить новую подписку</base-button>
            </div>

            <h5 class="Subtitle">Активыне подписки</h5>

            <base-expander-group>
              <base-expander
                slot="item"
                theme="with_borderBottom"
                v-for="(sub, index) in subscriptions"
                :key="index"
              >
                <div slot="summary" class="ExpanderSummaryContent">
                  <div>
                    <table class="Table theme_alfa">
                      <tbody>
                        <tr>
                          <td class="Column type_first">Название:</td>
                          <td class="Column type_second">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button 
                    class="ExpanderIconBtn"
                    type="button"
                    @click="(event) => {
                      deleteSubscription(sub);
                      // chosenSubscription = sub;
                      // toggleWindow('Subscription_Form');
                    }"
                  >
                    <span class="FontIcon name_trashFull size_lg"></span>
                    <!-- pencil icon for edit -->
                    <!-- <span class="FontIcon name_edit size_md"></span> -->
                  </button>
                </div>
                <table class="Table theme_alfa">
                  <tbody>
                    <tr>
                      <td class="Column type_first">Событие:</td>
                      <td class="Column type_second">
                        <div>{{sub.event.name}}</div>
                        <div>{{sub.eventPluginName}}</div>
                      </td>
                    </tr>
                    <tr v-if="sub.event.args.length">
                      <td class="Column type_first">Аргументы:</td>
                      <td class="Column type_second">
                        <pre>{{JSON.stringify(sub.event.args)}}</pre>
                      </td>
                    </tr>
                    <tr>
                      <td class="Column type_first">Действие:</td>
                      <td class="Column type_second">
                        <div>{{sub.action.name}}</div>
                        <div>{{sub.actionPluginName}}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </base-expander>
            </base-expander-group>
          </div>

          <div slot="tab" tab-name="Мои действия">
            <div class="TabTopBtnWrapper">
              <base-button
                theme="theme_blueSec"
                size="big"
                width="full"
                @click="toggleWindow('Action_Form')"
              >Создать действие</base-button>
            </div>

            <h5 class="Subtitle">Список действий</h5>

            <base-expander-group>
              <base-expander
                slot="item"
                theme="with_borderBottom"
                v-for="act in actions"
                :key="act.id"
              >
                <div slot="summary" class="ExpanderSummaryContent">
                  <div>
                    <table class="Table theme_alfa">
                      <tbody>
                        <tr>
                          <td class="Column type_first">Название:</td>
                          <td class="Column type_second">{{act.name}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button
                    v-if=" ! act.guid"
                    class="ExpanderIconBtn"
                    type="button"
                    @click="(event) => {
                      eventSystem.removeCustomAction(act.name);
                      // chosenAction = act;
                      // toggleWindow('Action_Form');
                    }"
                  >
                    <span class="FontIcon name_trashFull size_lg"></span>
                    <!-- pencil icon for edit -->
                    <!-- <span class="FontIcon name_edit size_md"></span> -->
                  </button>
                </div>
                <table class="Table theme_alfa">
                  <tbody>
                    <tr v-if="act.guid">
                      <td class="Column type_first">GUID:</td>
                      <td class="Column type_second">{{act.guid ? act.guid : '-'}}</td>
                    </tr>
                    <tr v-if="act.guid">
                      <td class="Column type_first">Плагин:</td>
                      <td class="Column type_second">{{act.pluginName}}</td>
                    </tr>
                  </tbody>
                </table>
              </base-expander>
            </base-expander-group>
          </div>
        </base-tabs>
      </div>
    </div>

    <SubscriptionForm
      v-if="typeVisibleWindow === 'Subscription_Form'"
      @closeSubscriptionForm="toggleWindow()"
      :currentSubscription="chosenSubscription"
    ></SubscriptionForm>

    <ActionForm
      v-if="typeVisibleWindow === 'Action_Form'"
      @closeActionForm="toggleWindow()"
      :currentAction="chosenAction"
    ></ActionForm>
  </div>
</template>

<script>
import SubscriptionForm from './SubscriptionForm.vue';
import ActionForm from './ActionForm';

export default {
  name: 'EventSystemPanel',
  components: {
    SubscriptionForm,
    ActionForm,
  },
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      plugin: this.$root.pluginInstance,
      guidPlugin: this.$root.guid,
      subscriptions: [],
      actions: [],
      typeVisibleWindow: 'Main',
      chosenAction: null,
      chosenSubscription: null,
    };
  },
  created() {
  },
  mounted() {
    this.subscriptions = this.eventSystem.subscriptions;
    this.subscriptions.map((sub) => {
      try {
        sub.eventPluginName = '';
        sub.actionPluginName = '';
        if (sub.event.guid) {
          sub.eventPluginName = this.getPluginNameByGUID(sub.event.guid) + ` (${sub.event.guid})`;
        }
        if (sub.action.guid) {
          sub.actionPluginName = this.getPluginNameByGUID(sub.action.guid) + ` (${sub.action.guid})`;
        }
      } catch (error) {
        if (error.message.indexOf('[guid] is undefined') != -1) {
          sub.eventPluginName = (sub.event.guid === this.guidPlugin) ? 'EventSystemPanel' : '';
          sub.actionPluginName = (sub.action.guid === this.guidPlugin) ? 'EventSystemPanel' : '';
        } else {
          throw error;
        }
      }
    });

    this.actions = this.eventSystem.actions;
    this.actions.map((act) => {
      try {
        act.pluginName = '-';
        if (act.guid) {
          act.pluginName = this.getPluginNameByGUID(act.guid);
        }
      } catch (error) {
        if (error.message.indexOf('[guid] is undefined') != -1) {
          act.pluginName = (act.guid === this.guidPlugin) ? 'EventSystemPanel' : '-';
        } else {
          throw error;
        }
      }
    });
  },
  methods: {
    toggleWindow(typeWindow) {
      switch (typeWindow) {
        case 'Subscription_Form':
        case 'Action_Form':
          this.typeVisibleWindow = typeWindow;
          break;

        case 'Main':
        default:
          this.typeVisibleWindow = 'Main';
          this.chosenAction = null;
          this.chosenSubscription = null;
          break;
      }

      return;
    },

    deleteSubscription(chosenSubscription) {
      const {
        event: {
          guid: eventGUID,
          name: eventName,
          args,
        },
        action: {
          guid: actionGUID,
          name: actionName,
        },
      } = chosenSubscription;

      this.eventSystem.unsubscribe(
        eventGUID,
        eventName,
        actionGUID,
        actionName,
        ...args
      );
    },

    getPluginNameByGUID(guid) {
      return this.plugin.getInstance
                        .call(null, guid)
                        .constructor.getRegistrationMeta().name;
    },
  },
};
</script>

<style lang="scss">
@import '../EventSystemPanel.scss';
</style>
