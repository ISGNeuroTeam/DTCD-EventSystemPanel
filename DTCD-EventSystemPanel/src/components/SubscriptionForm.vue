<template>
  <form @submit.prevent="handleFormSubmit" class="Wrapper">
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
        <BtnBack @click="$emit('closeSubscriptionForm')"/>
      </div>

      <div class="FieldContainer type_alfa">
        <base-input 
          label="Название показателя"
          required="true"
          size="big"
          @input="(event) => subscriptionName = event.target.value"
          :value="subscriptionName"
          :invalid="$v.subscriptionName.$dirty && $v.subscriptionName.$invalid"
        ></base-input>
      </div>

      <div class="GridContainer type_subscription">
        <div class="Column">
          <h5 class="Subtitle">События</h5>

          <div class="FieldContainer">
            <base-select
              label="Панель"
              size="big"
              required
              search
              :value="chosenPanel"
              @input="(event) => {
                chosenPanel = event.target.value;
                chosenEvent = '';
              }"
              :invalid="$v.chosenPanel.$dirty && $v.chosenPanel.$invalid"
            >
              <div
                slot="item"
                v-for="evt in allPanelsWithEvents"
                :key="evt.guid"
                :value="evt.guid"
                :data-visible-value="`GUID: ${evt.guid} Плагин: ${evt.plugin}`"
              >
                <div>GUID: {{ evt.guid }}</div>
                <div v-if="evt.plugin">Плагин: {{evt.plugin}}</div>
              </div>
            </base-select>
          </div>

          <div class="FieldContainer">
            <base-select
              label="Событие панели"
              size="big"
              required
              search
              :value="chosenEvent"
              @input="(event) => {
                chosenEvent = event.target.value;
                chosenArg = '';
              }"
              :invalid="$v.chosenEvent.$dirty && $v.chosenEvent.$invalid"
              :disabled="chosenPanel ? false : true"
            >
              <div
                slot="item"
                v-for="name in allEventsOfChosenPanel"
                :key="name"
                :value="name"
                :data-visible-value="name"
              >{{name}}</div>
            </base-select>
          </div>

          <div
            v-if="allArgumentsOfPanel.length"
            class="FieldContainer"
          >
            <base-select
              label="Аргумент события панели"
              size="big"
              required
              search
              :value="chosenArg"
              @input="(event) => {chosenArg = event.target.value;}"
              :invalid="$v.chosenArg.$dirty && $v.chosenArg.$invalid"
              :disabled="chosenEvent ? false : true"
            >
              <div
                slot="item"
                v-for="(arg, index) in allArgumentsOfPanel"
                :key="index"
                :value="arg"
                :data-visible-value="arg"
              >{{arg}}</div>
            </base-select>
          </div>
        </div>

        <div class="Column">
          <h5 class="Subtitle">Действия</h5>

          <div class="FieldContainer">
            <base-select
              label="Плагин"
              ref="actionSelect"
              size="big"
              required
              search
              :value="chosenPanelWithActions"
              @input="(event) => {
                chosenPanelWithActions = event.target.value;
                chosenAction = '';
              }"
              :invalid="$v.chosenPanelWithActions.$dirty && $v.chosenPanelWithActions.$invalid"
            >
              <div
                slot="item"
                v-for="act in allPanelsWithActions"
                :key="act.guid"
                :value="act.guid"
                :data-visible-value="(act.guid !== '-') ? `GUID: ${act.guid} Плагин: ${act.plugin}` : act.plugin"
              >
                <div v-if="act.guid !== '-'">
                  <div>GUID: {{ act.guid }}</div>
                  <div>Плагин: {{act.plugin}}</div>
                </div>
                <div v-if="act.guid === '-'">{{act.plugin}}</div>
              </div>
            </base-select>
          </div>

          <div class="FieldContainer">
            <base-select
              label="Действие"
              size="big"
              required
              search
              :value="chosenAction"
              @input="(event) => {
                chosenAction = event.target.value;
              }"
              :disabled="chosenPanelWithActions ? false : true"
              :invalid="$v.chosenAction.$dirty && $v.chosenAction.$invalid"
            >
              <div
                slot="item"
                v-for="name in allActionsOfChosenPanel"
                :key="name"
                :value="name"
                :data-visible-value="name"
              >{{name}}</div>
            </base-select>
          </div>
        </div>
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
          @click="$emit('closeSubscriptionForm')"
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
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, requiredIf } from '@vuelidate/validators/dist/raw.esm';

import BtnBack from './BtnBack';

export default {
  name: 'SubscriptionForm',
  components: {
    BtnBack,
  },
  mixins: [validationMixin],
  props: [
    'currentSubscription',
  ],
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      plugin: this.$root.pluginInstance,

      subscriptionName: '',
      
      allPanelsWithEvents: [],
      chosenPanel: this.currentSubscription ? this.currentSubscription.event.guid : '',

      allEventsOfChosenPanel: [],
      chosenEvent: this.currentSubscription ? this.currentSubscription.event.name : '',

      allArgumentsOfPanel: [],
      chosenArg: this.currentSubscription ? this.currentSubscription.event.args : '',

      allPanelsWithActions: [],
      chosenPanelWithActions: this.currentSubscription ? this.currentSubscription.action.guid : '',

      allActionsOfChosenPanel: [],
      chosenAction: this.currentSubscription ? this.currentSubscription.action.name : '',
    };
  },
  validations() {
    return {
      subscriptionName: {
        required,
      },
      chosenPanel: {
        required,
      },
      chosenEvent: {
        required,
      },
      chosenArg: {
        required: requiredIf(() => {
          return this.allArgumentsOfPanel.length;
        }),
      },
      chosenPanelWithActions: {
        required,
      },
      chosenAction: {
        required,
      },
    };
  },
  mounted() {
    const panelsGuidSet = new Set();
    this.eventSystem.events.forEach((event) => {
      panelsGuidSet.add(event.guid);
    });

    for (const guid of panelsGuidSet) {
      this.allPanelsWithEvents.push({
        guid,
        plugin: guid
                  ? this.plugin.getInstance
                      .call(null, guid)
                      .constructor.getRegistrationMeta().name
                  : '',
      });
    }

    const panelsActionSet = new Set();
    this.eventSystem.actions.forEach((action) => {
      panelsActionSet.add(action.guid);
    });

    for (const guid of panelsActionSet) {
      this.allPanelsWithActions.push({
        guid,
        plugin: guid
                  ? this.plugin.getInstance
                      .call(null, guid)
                      .constructor.getRegistrationMeta().name
                  : '',
      });
    }

    // custom actions
    this.allPanelsWithActions.push({
      guid: '-',
      plugin: 'Пользовательские события',
    });
  },
  methods: {
    createSubscription() {
      let args = [];
      try {
        args = JSON.parse(this.chosenArg);
      } catch (error) {}

      this.eventSystem.subscribe(
        this.chosenPanel,
        this.chosenEvent,
        this.chosenPanelWithActions,
        this.chosenAction,
        ...args
      );

      this.$root.logSystem.info(`Created subscription.`);
    },

    deleteSubscription() {
      if ( ! this.currentSubscription) {
        return;
      }

      const {
        event: { guid: eventGUID, name: eventName },
        action: { guid: actionGUID, name: actionName },
      } = this.currentSubscription;

      this.eventSystem.unsubscribe(
        eventGUID,
        eventName,
        actionGUID,
        actionName,
      );

      this.$root.logSystem.info(`Deleted subscription.`);
      this.$emit('closeSubscriptionForm');
    },

    handleSubmitBtnClick(event) {
      event.preventDefault();
      this.handleFormSubmit();
    },

    handleFormSubmit(event) {
      (event instanceof Event) && event.preventDefault();
      this.$root.logSystem.debug(`Submitted subscription form.`);
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.createSubscription();
        this.$emit('closeSubscriptionForm');
      }
    },
  },
  watch: {
    chosenPanel(newValue) {
      this.$root.logSystem.debug(`Start creation of array with all events of chosen panel.`);

      this.allEventsOfChosenPanel = [];

      this.eventSystem.events.forEach((event) => {
        if (event.guid === newValue) {
          this.allEventsOfChosenPanel.push(event.name);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all events of chosen panel.`);
    },

    chosenEvent(newValue) {
      this.$root.logSystem.debug(`Start creation of array with all arguments of panel.`);

      this.allArgumentsOfPanel = [];

      this.eventSystem.events.forEach((event) => {
        const isEqualGuid = event.guid === this.chosenPanel;
        const isEqualEventName = event.name === newValue;
        const emptyArgs = event.args.length ? false : true;
        const resultCondition = isEqualGuid && isEqualEventName && !emptyArgs;

        if (resultCondition) {
          this.allArgumentsOfPanel.push(event.args);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all arguments of panel.`);
    },

    chosenPanelWithActions(newValue) {
      this.$root.logSystem.debug(`Start creation of array with all actions of chosen panel.`);

      this.allActionsOfChosenPanel = [];

      let chosenActionGuid = newValue;
      if (newValue === '-') {
        chosenActionGuid = undefined;
      }

      this.eventSystem.actions.forEach((action) => {
        if (action.guid === chosenActionGuid) {
          this.allActionsOfChosenPanel.push(action.name);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all actions of chosen panel.`);
    },
  }
};
</script>