<template>
  <div class="EventSystemPanel">
    <div
      class="Wrapper"
      v-show="$root.typeVisibleWindow === 'Main'"
    >
      <div
        class="Header"
        v-if="config.isTitleVisible"
      >
        <h4 class="mainTitle">
          Панель системы событий и действий
        </h4>
      </div>

      <base-tabs
        class="TabContainer"
        @select="tabSelectHandler"
      >
        <div slot="tab" tab-name="Подписки"></div>
        <div slot="tab" tab-name="Действия"></div>
      </base-tabs>

      <div v-show="selectedTab === 0" open="true">
        <div class="TabTopBtnWrapper">
          <base-input
            type="search"
            class="SearchSubscribe"
            @input="searchStringSubs = $event.target.value"
          >
            <span slot="icon-left" class="FontIcon name_searchSmall size_lg"></span>
          </base-input>

          <base-button
            theme="theme_blueSec"
            @click="toggleWindow('Subscription_Form')"
          > Создать
          </base-button>
        </div>
      </div>

      <div v-show="selectedTab === 1" open="true">
        <div class="TabTopBtnWrapper">
          <base-input
            type="search"
            class="SearchSubscribe"
            @input="searchStringActions = $event.target.value"
          >
            <span slot="icon-left" class="FontIcon name_searchSmall size_lg"></span>
          </base-input>

          <base-button
            theme="theme_blueSec"
            @click="toggleWindow('Action_Form')"
          > Создать
          </base-button>
        </div>
      </div>

      <div class="PanelList" v-if="selectedTab === 0">
        <base-expander-group>
          <template v-for="(sub, index) in subscriptions">
            <base-expander
              slot="item"
              theme="with_borderBottom"
              :key="index"
              v-if="toSearchSubscription(sub)"
            >
              <div slot="summary" class="ExpanderSummaryContent">
                <div>
                  <table class="Table theme_alfa">
                    <tbody>
                      <tr>
                        <td class="Column type_first">Название:</td>
                        <td class="Column type_second">{{sub.subscriptionName || '-'}}</td>
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
                  v-if="sub.subscriptionType !== 'system'"
                >
                  <span class="FontIcon name_trashFull size_md"></span>
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
                      <div>{{sub.event.guid}}</div>
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
                      <div>{{sub.action.guid}}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </base-expander>
          </template>
        </base-expander-group>
      </div>

      <div class="PanelList" v-if="selectedTab === 1">
        <base-expander-group>
          <template v-for="(act, index) in actions">
            <base-expander
              slot="item"
              theme="with_borderBottom"
              :key="index"
              v-if="toSearchAction(act)"
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
                  v-if=" !act.guid"
                  class="ExpanderIconBtn"
                  type="button"
                  @click="(event) => {
                    eventSystem.removeCustomAction(act.name);
                    // chosenAction = act;
                    // toggleWindow('Action_Form');
                  }"
                >
                  <span class="FontIcon name_trashFull size_md"></span>
                </button>
                <button
                  v-if="!act.guid"
                  class="ExpanderIconBtn"
                  type="button"
                  style="margin-left: 8px"
                  @click="editCustomAction(act)"
                >
                  <span class="FontIcon name_edit size_md"></span>
                </button>
              </div>
              <table class="Table theme_alfa">
                <tbody>
                  <tr v-if="act.guid">
                    <td class="Column type_first">GUID:</td>
                    <td class="Column type_second">{{act.guid ? act.guid : 'Пользовательское событие'}}</td>
                  </tr>
                </tbody>
              </table>
            </base-expander>
          </template>
        </base-expander-group>
      </div>
    </div>

    <SubscriptionForm
      v-if="$root.typeVisibleWindow === 'Subscription_Form'"
      @closeSubscriptionForm="toggleWindow()"
      :currentSubscription="chosenSubscription"
    ></SubscriptionForm>

    <ActionForm
      v-if="$root.typeVisibleWindow === 'Action_Form'"
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
      subscriptions: [],
      actions: [],
      chosenAction: null,
      chosenSubscription: null,
      selectedTab: 0,
      config: {
        isTitleVisible: true,
      },
      searchStringSubs: '',
      searchStringActions: '',
    };
  },
  computed: {
    eventSystem() { return this.$root.eventSystem; },
    plugin() { return this.$root.pluginInstance; },
  },
  mounted() {
    this.subscriptions = this.eventSystem.subscriptions;
    this.actions = this.eventSystem.actions;
  },
  methods: {
    setIsTitleVisible(value = '') {
      this.config.isTitleVisible = value;
    },

    tabSelectHandler(event) {
      const { tabIndex } = event.target.activeTab;
      this.selectedTab = tabIndex;
    },

    toggleWindow(typeTargetPanel) {
      this.$root.logSystem.info(`Change screens to '${typeTargetPanel}'.`);

      switch (typeTargetPanel) {
        case 'Subscription_Form':
        case 'Action_Form':
          this.$root.typeVisibleWindow = typeTargetPanel;
          break;

        case 'Main':
        default:
          this.$root.typeVisibleWindow = 'Main';
          this.chosenAction = null;
          this.chosenSubscription = null;
          break;
      }

      return;
    },

    deleteSubscription(chosenSubscription) {
      if (confirm('Вы действительно хотите удалить подписку?')) {
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

        this.$root.logSystem.info(`Deleted subscription.`);
      }
    },

    editCustomAction(action) {
      this.chosenAction = action;
      this.toggleWindow('Action_Form');
    },

    toSearchSubscription(sub) {
      const { subscriptionType = '', subscriptionName = '' } = sub;

      if (subscriptionType === 'system') {
        return false;
      }

      if (this.searchStringSubs.length > 0) {
        const name = subscriptionName.toLowerCase();
        const search = this.searchStringSubs.toLowerCase();
        return name.includes(search);
      }

      return true;
    },

    toSearchAction(act) {
      if (this.searchStringActions.length > 0) {
        const name = act.name.toLowerCase();
        const search = this.searchStringActions.toLowerCase();
        return name.includes(search);
      }

      return true;
    },
  },
};
</script>

<style lang="scss">
@import '../EventSystemPanel.scss';
</style>
