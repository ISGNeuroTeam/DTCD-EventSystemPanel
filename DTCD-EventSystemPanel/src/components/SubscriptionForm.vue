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
          @input="(event) => subscriptionFormData.subscriptionName = event.target.value"
          :value="subscriptionFormData.subscriptionName"
          :invalid="$v.subscriptionFormData.subscriptionName.$dirty && $v.subscriptionFormData.subscriptionName.$invalid"
        ></base-input>
      </div>

      <div class="GridContainer type_subscription">
        <div class="Column">
          <h5 class="Subtitle">События</h5>

          <div class="FieldContainer">
            <base-select
              size="big"
              required
              search
              :value="subscriptionFormData.chosenPanel"
              @input="(event) => {
                subscriptionFormData.chosenPanel = event.target.value;
                subscriptionFormData.chosenEvent = '';
              }"
              :invalid="$v.subscriptionFormData.chosenPanel.$dirty && $v.subscriptionFormData.chosenPanel.$invalid"
            >
              <span slot="label">Панель</span>
              <div
                slot="item"
                v-for="evt in allPanelsWithEvents"
                :key="evt.guid"
                :value="evt.guid"
                :data-visible-value="evt.guid"
              >{{ evt.guid || '-' }}</div>
            </base-select>
          </div>

          <div class="FieldContainer">
            <base-select
              size="big"
              required
              search
              :value="subscriptionFormData.chosenEvent"
              @input="(event) => {
                subscriptionFormData.chosenEvent = event.target.value;
                subscriptionFormData.chosenArg = '';
              }"
              :invalid="$v.subscriptionFormData.chosenEvent.$dirty && $v.subscriptionFormData.chosenEvent.$invalid"
              :disabled="subscriptionFormData.chosenPanel ? false : true"
            >
              <span slot="label">Событие панели</span>
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
              size="big"
              required
              search
              :value="subscriptionFormData.chosenArg"
              @input="(event) => {subscriptionFormData.chosenArg = event.target.value;}"
              :invalid="$v.subscriptionFormData.chosenArg.$dirty && $v.subscriptionFormData.chosenArg.$invalid"
              :disabled="subscriptionFormData.chosenEvent ? false : true"
            >
              <span slot="label">Аргумент события панели</span>
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
              ref="actionSelect"
              size="big"
              required
              search
              :value="subscriptionFormData.chosenPanelWithActions"
              @input="(event) => {
                subscriptionFormData.chosenPanelWithActions = event.target.value;
                subscriptionFormData.chosenAction = '';
              }"
              :invalid="$v.subscriptionFormData.chosenPanelWithActions.$dirty && $v.subscriptionFormData.chosenPanelWithActions.$invalid"
            >
              <span slot="label">Панель</span>
              <div
                slot="item"
                v-for="act in allPanelsWithActions"
                :key="act.guid"
                :value="act.guid"
                :data-visible-value="act.guid"
              >{{ act.guid || '-' }}</div>
            </base-select>
          </div>

          <div class="FieldContainer">
            <base-select
              size="big"
              required
              search
              :value="subscriptionFormData.chosenAction"
              @input="(event) => {
                subscriptionFormData.chosenAction = event.target.value;
              }"
              :disabled="subscriptionFormData.chosenPanelWithActions ? false : true"
              :invalid="$v.subscriptionFormData.chosenAction.$dirty && $v.subscriptionFormData.chosenAction.$invalid"
            >
              <span slot="label">Действие</span>
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
          @click="() => {
            this.resetForm();
            this.$emit('closeSubscriptionForm');
          }"
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

      subscriptionFormData: this.currentSubscription
        ? {
          subscriptionName: '',
          chosenPanel: this.currentSubscription.event.guid,
          chosenEvent: this.currentSubscription.event.name,
          chosenArg: this.currentSubscription.event.args,
          chosenPanelWithActions: this.currentSubscription.action.guid,
          chosenAction: this.currentSubscription.action.name,
        }
        : this.$root.subscriptionFormData,

      allPanelsWithEvents: [],
      allEventsOfChosenPanel: [],
      allArgumentsOfPanel: [],
      allPanelsWithActions: [],
      allActionsOfChosenPanel: [],
    };
  },
  validations() {
    return {
      subscriptionFormData: {
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
      }
    };
  },
  created() {
    // Events
    const panelsGuidSet = new Set();
    this.eventSystem.events.forEach((event) => {
      panelsGuidSet.add(event.guid);
    });

    for (const guid of panelsGuidSet) {
      this.allPanelsWithEvents.push({
        guid,
      });
    }

    this.collectEventsOfChosenPanel();
    this.collectArgsOfChosenEvent();

    // Actions
    const panelsActionSet = new Set();
    this.eventSystem.actions.forEach((action) => {
      panelsActionSet.add(action.guid);
    });

    for (const guid of panelsActionSet) {
      this.allPanelsWithActions.push({
        guid,
      });
    }

    // custom actions
    this.allPanelsWithActions.push({
      guid: '-'
    });

    this.collectActionsOfChosenPanel();
  },
  methods: {
    createSubscription() {
      let args = [];
      try {
        args = JSON.parse(this.subscriptionFormData.chosenArg);
      } catch (error) {}

      this.eventSystem.subscribe(
        this.subscriptionFormData.chosenPanel,
        this.subscriptionFormData.chosenEvent,
        this.subscriptionFormData.chosenPanelWithActions,
        this.subscriptionFormData.chosenAction,
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
        this.resetForm();
        this.$emit('closeSubscriptionForm');
      }
    },

    resetForm() {
      this.$root.subscriptionFormData = {
        subscriptionName: '',
        chosenPanel: '',
        chosenEvent: '',
        chosenArg: '',
        chosenPanelWithActions: '',
        chosenAction: '',
      };
    },

    collectEventsOfChosenPanel() {
      this.$root.logSystem.debug(`Start creation of array with all events of chosen panel.`);

      this.allEventsOfChosenPanel = [];

      this.eventSystem.events.forEach((event) => {
        if (event.guid === this.subscriptionFormData.chosenPanel) {
          this.allEventsOfChosenPanel.push(event.name);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all events of chosen panel.`);
    },

    collectArgsOfChosenEvent() {
      this.$root.logSystem.debug(`Start creation of array with all arguments of panel.`);

      this.allArgumentsOfPanel = [];

      this.eventSystem.events.forEach((event) => {
        const isEqualGuid = event.guid === this.chosenPanel;
        const isEqualEventName = event.name === this.subscriptionFormData.chosenEvent;
        const emptyArgs = event.args.length ? false : true;
        const resultCondition = isEqualGuid && isEqualEventName && !emptyArgs;

        if (resultCondition) {
          this.allArgumentsOfPanel.push(event.args);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all arguments of panel.`);
    },

    collectActionsOfChosenPanel() {
      this.$root.logSystem.debug(`Start creation of array with all actions of chosen panel.`);

      this.allActionsOfChosenPanel = [];

      let chosenActionGuid = this.subscriptionFormData.chosenPanelWithActions;
      if (chosenActionGuid === '-') {
        chosenActionGuid = undefined;
      }

      this.eventSystem.actions.forEach((action) => {
        if (action.guid === chosenActionGuid) {
          this.allActionsOfChosenPanel.push(action.name);
        }
      });

      this.$root.logSystem.debug(`End creation of array with all actions of chosen panel.`);
    },
  },
  watch: {
    'subscriptionFormData.chosenPanel': function() {
      this.collectEventsOfChosenPanel();
    },

    'subscriptionFormData.chosenEvent': function() {
      this.collectArgsOfChosenEvent();
    },

    'subscriptionFormData.chosenPanelWithActions': function() {
      this.collectActionsOfChosenPanel();
    },
  },
};
</script>