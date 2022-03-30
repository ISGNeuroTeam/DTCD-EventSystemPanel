<template>
  <div class="Wrapper">
    <div class="Header">
      <base-heading theme="theme_subheaderSmall">
        <h4>
          {{
            currentSubscription
              ? 'Изменить подписку'
              : 'Создать новую подписку'
          }}
        </h4>
      </base-heading>
    </div>

    <div class="Body">
      <div class="BtnBackWrapper">
        <BtnBack @click="() => toggleWindow()"/>
      </div>

      <div class="FieldContainer">
        <base-input 
          label="Название показателя"
          required="true"
          size="big"
        ></base-input>
      </div>

      <div class="FieldContainer">
        <base-select
          label="Событие"
          ref="eventSelect"
          size="big"
          required
          search
          :value="currentSubscription ? currentSubscription.event : ''"
        >
          <div slot="item" v-for="evt in allEvents" :key="evt.id" :value="evt">
            <div class="plugin-info-container">
              <div>Название: {{ evt.name }}</div>
              <div>GUID: {{ evt.guid }}</div>
              <div>
                Плагин: 
                {{
                  evt.guid
                    ? plugin.getInstance
                        .call(null, evt.guid)
                        .constructor.getRegistrationMeta().name
                    : ''
                }}
              </div>
            </div>
          </div>
        </base-select>
      </div>

      <div class="FieldContainer">
        <base-select
          label="Действие"
          ref="actionSelect"
          size="big"
          required
          search
          :value="currentSubscription ? currentSubscription.action : ''"
        >
          <div slot="item" v-for="act in allActions" :key="act.id" :value="act">
            <div class="plugin-info-container">
              <div>Название: {{ act.name }}</div>
              <div>GUID: {{ act.guid }}</div>
              <div>
                Плагин: 
                {{
                  act.guid
                    ? plugin.getInstance
                        .call(null, act.guid)
                        .constructor.getRegistrationMeta().name
                    : ''
                }}
              </div>
            </div>
          </div>
        </base-select>
      </div>
    </div>

    <div class="Footer">
      <div
        v-if="currentSubscription"
        class="BtnWrapper"
      >
        <base-button
          width="full"
          size="big"
          theme="theme_red"
          @click="deleteSubscription"
        >Удалить подписку</base-button>
      </div>
      <div class="BtnWrapper">
        <base-button
          width="full"
          size="big"
          theme="theme_secondary"
          @click="() => toggleWindow()"
        >Отменить</base-button>
      </div>
      <div class="BtnWrapper">
        <base-button
          width="full"
          size="big"
          @click="handleSubmitBtnClick"
        >Сохранить</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import BtnBack from './BtnBack';

export default {
  name: 'SubscriptionForm',
  components: {
    BtnBack,
  },
  props: [
    'allEvents',
    'allActions',
    'toggleWindow',
    'currentSubscription',
  ],
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      plugin: this.$root.pluginInstance,
      allEvents: [],
      allActions: [],
    };
  },
  methods: {
    createSubscription() {
      this.$refs.eventSelect.validate();
      const selectedEvent = this.eventSystem.events.find(
        (evt) => evt.id === this.$refs.eventSelect.value
      );
      const selectedAction = this.eventSystem.actions.find(
        (act) => act.id === this.$refs.actionSelect.value
      );

      this.eventSystem.subscribe(
        selectedEvent.guid,
        selectedEvent.name,
        selectedAction.guid,
        selectedAction.name,
      );
    },

    deleteSubscription() {
      const {
        event: { guid: eventGUID, name: eventName },
        action: { guid: actionGUID, name: actionName },
      } = this.subscription;

      this.eventSystem.unsubscribe(
        eventGUID,
        eventName,
        actionGUID,
        actionName,
      );

      this.toggleWindow();
    },

    handleSubmitBtnClick(event) {
      event.preventDefault();
      this.createSubscription();
      this.toggleWindow();
    }
  },
};
</script>