<template>
  <div 
    class="EventSystemPanel"
  >
    <div
      class="Wrapper"
      :style="{display: typeVisibleWindow === 'Main' ? '' : 'none'}"
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
                  <div>Название: -</div>
                  <button 
                    class="ExpanderIconBtn"
                    type="button"
                    @click="(event) => {
                      chosenSubscription = sub;
                      toggleWindow('Subscription_Form');
                    }"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.60599 16C6.43667 15.9997 6.27527 15.9283 6.16115 15.8032C6.04492 15.6791 5.98717 15.5113 6.0024 15.3419L6.15028 13.7154L12.9817 6.88449L15.1166 9.01938L8.28699 15.8497L6.66092 15.9976C6.64221 15.9994 6.6235 16 6.60599 16ZM15.5428 8.59252L13.4085 6.45764L14.6887 5.17707C14.8019 5.0637 14.9555 5 15.1157 5C15.2759 5 15.4295 5.0637 15.5428 5.17707L16.823 6.45764C16.9363 6.57088 17 6.72455 17 6.8848C17 7.04504 16.9363 7.19871 16.823 7.31195L15.5434 8.59192L15.5428 8.59252Z" fill="#0579F7"/>
                    </svg>
                  </button>
                </div>
                <div>
                  Событие: {{sub.event.name}}
                  (Плагин: 
                  {{
                    sub.event.guid
                      ? plugin.getInstance
                          .call(null, sub.event.guid)
                          .constructor.getRegistrationMeta().name
                      : ''
                  }}
                  ({{sub.event.guid}}))
                </div>
                <div>
                  Действие: {{sub.action.name}} ({{sub.action.guid}})
                </div>
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
                  <div>Название: {{act.name}}</div>
                  <button 
                    class="ExpanderIconBtn"
                    type="button"
                    @click="(event) => {
                      //eventSystem.removeCustomAction(act.name);
                      chosenAction = act;
                      toggleWindow('Action_Form');
                    }"
                  >
                    <!-- <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 20H4C2.89543 20 2 19.1046 2 18V5H0V3H4V2C4 0.89543 4.89543 0 6 0H12C13.1046 0 14 0.89543 14 2V3H18V5H16V18C16 19.1046 15.1046 20 14 20ZM4 5V18H14V5H4ZM6 2V3H12V2H6ZM12 16H10V7H12V16ZM8 16H6V7H8V16Z" fill="#17569B"/>
                    </svg> -->
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.60599 16C6.43667 15.9997 6.27527 15.9283 6.16115 15.8032C6.04492 15.6791 5.98717 15.5113 6.0024 15.3419L6.15028 13.7154L12.9817 6.88449L15.1166 9.01938L8.28699 15.8497L6.66092 15.9976C6.64221 15.9994 6.6235 16 6.60599 16ZM15.5428 8.59252L13.4085 6.45764L14.6887 5.17707C14.8019 5.0637 14.9555 5 15.1157 5C15.2759 5 15.4295 5.0637 15.5428 5.17707L16.823 6.45764C16.9363 6.57088 17 6.72455 17 6.8848C17 7.04504 16.9363 7.19871 16.823 7.31195L15.5434 8.59192L15.5428 8.59252Z" fill="#0579F7"/>
                    </svg>
                  </button>
                </div>
                <div>
                  <div v-if="act.guid">
                    GUID: {{act.guid ? act.guid : '-'}}
                  </div>
                  <div v-if="act.guid">
                    Плагин: 
                    {{
                      act.guid
                        ? plugin.getInstance
                            .call(null, act.guid)
                            .constructor.getRegistrationMeta().name
                        : '-'
                    }}
                  </div>
                </div>
              </base-expander>
            </base-expander-group>
          </div>
        </base-tabs>
      </div>
    </div>

    <SubscriptionForm
      v-if="typeVisibleWindow === 'Subscription_Form'"
      :allEvents="events"
      :allActions="actions"
      :toggleWindow="toggleWindow"
      :currentSubscription="chosenSubscription"
    ></SubscriptionForm>

    <ActionForm
      v-if="typeVisibleWindow === 'Action_Form'"
      :toggleWindow="toggleWindow"
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
      subscriptions: [],
      events: [],
      actions: [],
      typeVisibleWindow: 'Main',
      chosenAction: null,
      chosenSubscription: null,
    };
  },
  mounted() {
    this.subscriptions = this.eventSystem.subscriptions;
    this.events = this.eventSystem.events;
    this.actions = this.eventSystem.actions;
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
  },
};
</script>

<style lang="scss">
@import '../EventSystemPanel.scss';
</style>
