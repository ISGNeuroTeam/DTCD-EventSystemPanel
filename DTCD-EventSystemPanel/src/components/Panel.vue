<template>
  <div 
    class="EventSystemPanel"
  >
    <div
      class="Wrapper"
      v-if="typeVisibleWindow === 'main'"
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
                <div slot="summary">
                  Название: -
                </div>
                <div>
                  Событие: {{sub.event.name}} ({{sub.event.guid}})
                </div>
                <div>
                  Действие: {{sub.action.guid}} ({{sub.action.guid}})
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
                    class="EditBtn"
                    type="button"
                    @click="(event) => {
                      chosenAction = act;
                      toggleWindow('Action_Form');
                    }"
                  >
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

      <hr style="width: 100%; border: 1px solid red; margin-top: 30px;">

      <!-- to create CustomAction -->
      <base-button @click="showCreateActionModal = !showCreateActionModal"
        >Создать действие</base-button
      >
      <modal
        v-show="showCreateActionModal"
        @close="showCreateActionModal = !showCreateActionModal"
        :type="'CreateAction'"
      />

      <!-- to remove CustomAction -->
      <base-button @click="showRemoveActionModal = !showRemoveActionModal"
        >Удалить действие</base-button
      >
      <modal
        v-show="showRemoveActionModal"
        @close="showRemoveActionModal = !showRemoveActionModal"
        :type="'RemoveAction'"
      />

      <!-- Subscriptions -->
      <div
        class="subscription-container"
        v-for="(sub, index) in subscriptions"
        :key="index"
      >
        <Subscription :subscription="sub" />
      </div>

      <div style="margin-left: 10px">Добавить подписку:</div>

      <div class="new-subscription">
        <base-select ref="eventSelect" required class="event-select" search
          ><div slot="item" v-for="evt in events" :key="evt.id" :value="evt">
            <div class="plugin-info-container">
              <div class="plugin-name">
                {{
                  evt.guid
                    ? plugin.getInstance
                        .call(null, evt.guid)
                        .constructor.getRegistrationMeta().name
                    : ""
                }}
              </div>
              <div class="plugin-guid">
                {{ evt.guid }}
              </div>
            </div>
            <div>
              {{ evt.name }}
            </div>
          </div></base-select
        >
        <base-select ref="actionSelect" required search
          ><div slot="item" v-for="act in actions" :key="act.id" :value="act">
            <div class="plugin-info-container">
              <div class="plugin-name">
                {{
                  act.guid
                    ? plugin.getInstance
                        .call(null, act.guid)
                        .constructor.getRegistrationMeta().name
                    : ""
                }}
              </div>
              <div class="plugin-guid">
                {{ act.guid }}
              </div>
            </div>
            <div>
              {{ act.name }}
            </div>
          </div></base-select
        >
        <svg
          class="add-subscription-button"
          @click="subscribe"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"
          />
        </svg>
      </div>
    </div>

    <SubscriptionForm
      v-if="typeVisibleWindow === 'Subscription_Form'"
      :allEvents="events"
      :allActions="actions"
      :toggleWindow="toggleWindow"
    ></SubscriptionForm>

    <ActionForm
      v-if="typeVisibleWindow === 'Action_Form'"
      :toggleWindow="toggleWindow"
      :currentAction="chosenAction"
    ></ActionForm>
  </div>
</template>

<script>
import Subscription from './Subscription.vue';
import SubscriptionForm from './SubscriptionForm.vue';
import ActionForm from './ActionForm';
import Modal from './Modal.vue';

export default {
  name: 'EventSystemPanel',
  components: {
    Subscription,
    Modal,
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
      typeVisibleWindow: 'main',
      chosenAction: null,

      showCreateActionModal: false,
      showRemoveActionModal: false,
    };
  },
  mounted() {
    this.subscriptions = this.eventSystem.subscriptions;
    this.events = this.eventSystem.events;
    this.actions = this.eventSystem.actions;
  },
  methods: {
    subscribe() {
      this.$refs.eventSelect.validate();
      const event = this.eventSystem.events.find(
        (evt) => evt.id === this.$refs.eventSelect.value
      );
      const action = this.eventSystem.actions.find(
        (act) => act.id === this.$refs.actionSelect.value
      );
      this.eventSystem.subscribe(
        event.guid,
        event.name,
        action.guid,
        action.name
      );
    },

    toggleWindow(typeWindow) {
      switch (typeWindow) {
        case 'Subscription_Form':
        case 'Action_Form':
          this.typeVisibleWindow = typeWindow;
          break;

        case 'main':
        default:
          this.typeVisibleWindow = 'main';
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
