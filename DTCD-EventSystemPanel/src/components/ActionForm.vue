<template>
  <form @submit.prevent="handleFormSubmit" class="Wrapper">
    <div class="Header">
      <h4 class="mainTitle">
        {{
          currentAction
            ? 'Редактировать действие'
            : 'Создание нового действия'
        }}
      </h4>
      <div class="BtnWrapper">
        <base-tooltip
          content="Вернуться к действиям"
          placement="bottom"
        >
          <base-button
            theme="theme_secondary"
            @click="$emit('closeActionForm')"
          > Назад
            <span slot="icon-left" class="Icon FontIcon name_chevronBigDown rotate_90 size_md "></span>
          </base-button>
        </base-tooltip>

        <base-button
          v-if="currentSubscription"
          theme="theme_red"
          @click="deleteSubscription"
        >
          Удалить подписку
        </base-button>

        <base-tooltip
          content="Отменить"
          placement="bottom"
        >
          <base-icon-button
            theme="theme_red"
            @click="handleCancelBtnClick"
          >
            <span class="FontIcon name_closeSmall size_lg"></span>
          </base-icon-button>
        </base-tooltip>

        <base-tooltip
          content="Сохранить"
          placement="bottom"
        >
          <base-icon-button
            @click="handleSubmitBtnClick"
          >
            <span class="FontIcon name_check size_lg"></span>
          </base-icon-button>
        </base-tooltip>
      </div>
    </div>

    <div class="Body">

      <div class="FieldContainer">
        <base-input
          class="Param"
          label="Название действия"
          required
          size="big"
          :value="actionFormData.name"
          @input="(e) => (actionFormData.name = e.target.value)"
          :invalid="$v.actionFormData.name.$error"
        ></base-input>

        <div class="AddParam">
          <base-input
            class="Param type_full"
            label="Имя параметра"
            size="big"
            :value="actionFormData.nameNewParam"
            @input="(e) => (actionFormData.nameNewParam = e.target.value)"
            :invalid="$v.actionFormData.nameNewParam.$error"
          >
          </base-input>

          <base-tooltip
            class="ParamIconWrapper"
            content="Добавить параметр"
            placement="top"
          >
            <base-icon-button
              theme="theme_primary"
              @click="addNewParameter"
            >
              <span class="FontIcon name_plus size_lg"></span>
            </base-icon-button>
          </base-tooltip>
        </div>
      </div>

      <div class="ActionParams">
        <base-chip
          class="ParamsWrapper"
          close="remove"
          v-for="(param, index) in actionFormData.parameters"
          @remove="removeParameter(index)"
          :key="index"
          >{{ param }}</base-chip
        >
      </div>

      <base-textarea
        label="Функция"
        required
        placeholder="Тело JS-функции"
        size="big"
        :value="actionFormData.body"
        @input="(e) => (actionFormData.body = e.target.value)"
        :invalid="$v.actionFormData.body.$error"
      ></base-textarea>
    </div>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from '@vuelidate/validators/dist/raw.esm';

import {
  firstCharIsNotNumber,
  notEqualToReserveWords,
  hasntSpecialChars,
} from '../validators/validators';

export default {
  name: 'ActionForm',
  mixins: [validationMixin],
  props: [
    'currentAction',
  ],
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      actionFormData: {
        name: '',
        nameNewParam: '',
        parameters: [],
        body: '',
      },
    };
  },
  validations: {
    actionFormData: {
      name: { required },
      body: { required },
      nameNewParam: {
        required,
        firstCharIsNotNumber,
        notEqualToReserveWords,
        hasntSpecialChars,
      },
    }
  },
  mounted() {
    if (!this.currentAction) return;

    const callback = this.currentAction.callback.toString().trim();

    const argsOpeningBrace = callback.indexOf('(');
    const argsClosingBrace = callback.indexOf(')');
    const argsList = callback.substring(argsOpeningBrace + 1, argsClosingBrace).trim();

    this.actionFormData.name = this.currentAction.name;
    this.actionFormData.body = callback.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
    this.actionFormData.parameters = argsList.length > 0 ? argsList.split(',') : [];
  },
  methods: {
    handleCancelBtnClick() {
      this.resetForm();
      this.$emit('closeActionForm');
    },

    handleSubmitBtnClick() {
      this.handleFormSubmit();
    },

    handleFormSubmit() {
      this.$root.logSystem.debug(`Submitted action form.`);
      this.$v.actionFormData.name.$touch();
      this.$v.actionFormData.body.$touch();

      if (!this.$v.$invalid) {
        this.saveCustomAction();
        this.handleCancelBtnClick();
      }
    },

    handleDeleteBtnClick() {
      this.eventSystem.removeCustomAction(this.actionFormData.name);
      this.$root.logSystem.info(`Removed custom action.`);
      this.handleCancelBtnClick();
    },

    addNewParameter() {
      this.$v.actionFormData.nameNewParam.$touch();

      if (!this.$v.actionFormData.nameNewParam.$invalid) {
        const {
          nameNewParam,
          parameters,
        } = this.actionFormData;

        if (!Array.isArray(parameters)) parameters = [];
        if (!parameters.includes(nameNewParam)) parameters.push(nameNewParam);

        this.actionFormData.nameNewParam = '';
        this.$v.actionFormData.nameNewParam.$reset();
      }
    },

    removeParameter(index) {
      this.actionFormData.parameters.splice(index, 1);
    },

    saveCustomAction() {
      const { name, parameters, body } = this.actionFormData;

      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const callback = new AsyncFunction(...parameters, body);

      if (this.currentAction) {
        this.currentAction.callback = callback;
        this.$root.logSystem.info(`Updated "${name}" custom action.`);
      } else {
        this.eventSystem.registerCustomAction(name, callback);
        this.$root.logSystem.info(`Registered "${name}" custom action.`);
      }

    },

    resetForm() {
      this.$root.actionFormData = {
        name: '',
        nameNewParam: '',
        parameters: [],
        body: '',
      };
    },
  },
};
</script>
