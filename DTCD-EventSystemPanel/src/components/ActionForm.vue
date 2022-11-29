<template>
  <form @submit.prevent="handleFormSubmit" class="Wrapper">
    <div class="Header">
      <base-heading theme="theme_subheaderSmall">
        <h4>
          {{
            currentAction
              ? 'Редактировать действие'
              : 'Создание нового действия'
          }}
        </h4>
      </base-heading>
    </div>

    <div class="Body">
      <div class="BtnBackWrapper">
        <BtnBack @click="$emit('closeActionForm')"/>
      </div>

      <div class="FieldContainer">
        <base-input
          label="Название действия"
          required
          size="big"
          :value="dataActionForm.name"
          @input="(e) => (dataActionForm.name = e.target.value)"
          :invalid="$v.dataActionForm.name.$dirty && $v.dataActionForm.name.$invalid"
        ></base-input>
      </div>

      <div class="FieldContainer type_params">
        <base-input 
          label="Имя параметра"
          size="big"
          :value="dataActionForm.nameNewParam"
          @input="(e) => (dataActionForm.nameNewParam = e.target.value)"
        ></base-input>
        <button
          type="button"
          class="ActionParamsAddBtn"
          title="Добавить параметр функции"
          @click="addNewParameter"
        >
          <span class="Icon FontIcon name_plusCircle size_xl"></span>
        </button>
      </div>

      <div class="ActionParams">
        <base-chip
          class="ParamsWrapper"
          close="remove"
          v-for="(param, index) in dataActionForm.parameters"
          @remove="removeParameter(index)"
          :key="index"
          >{{ param }}</base-chip
        >
      </div>

      <div class="FieldContainer">
        <base-textarea
          label="Функция"
          required
          placeholder="Тело JS-функции"
          size="big"
          :value="dataActionForm.body"
          @input="(e) => (dataActionForm.body = e.target.value)"
          :invalid="$v.dataActionForm.body.$dirty && $v.dataActionForm.body.$invalid"
        ></base-textarea>
      </div>
    </div>

    <div class="Footer">
      <div
        v-if="currentAction"
        class="BtnWrapper"
      >
        <base-button
          width="full"
          size="big"
          theme="theme_red"
          @click="handleDeleteBtnClick"
        >Удалить действие</base-button>
      </div>
      <div class="BtnWrapper">
        <base-button
          width="full"
          size="big"
          theme="theme_secondary"
          @click="$emit('closeActionForm')"
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
import { required } from '@vuelidate/validators/dist/raw.esm';

import BtnBack from './BtnBack';

export default {
  name: 'ActionForm',
  components: {
    BtnBack,
  },
  mixins: [validationMixin],
  props: [
    'currentAction',
  ],
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      dataActionForm: this.currentAction
                      ? {
                        name: this.currentAction.name,
                        nameNewParam: '',
                        parameters: [],
                        body: this.currentAction.body,
                      }
                      : this.$root.dataActionForm,
    };
  },
  validations() {
    return {
      dataActionForm: {
        name: { required },
        body: { required },
      }
    };
  },
  methods: {
    handleSubmitBtnClick(event) {
      event.preventDefault();
      this.handleFormSubmit();
    },

    handleFormSubmit(event) {
      (event instanceof Event) && event.preventDefault();
      this.$root.logSystem.debug(`Submitted action form.`);
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveCustomAction();
        this.$emit('closeActionForm');
      }
    },

    handleDeleteBtnClick(event) {
      event.preventDefault();
      this.eventSystem.removeCustomAction(this.dataActionForm.name);
      this.$root.logSystem.info(`Removed custom action.`);
      this.$emit('closeActionForm');
    },

    addNewParameter() {
      if (this.dataActionForm.nameNewParam) {
        if (!Array.isArray(this.dataActionForm.parameters)) {
          this.dataActionForm.parameters = [];
        }
        this.dataActionForm.parameters.push(this.dataActionForm.nameNewParam);
        this.dataActionForm.nameNewParam = '';
      }
    },

    removeParameter(index) {
      this.dataActionForm.parameters.splice(index, 1);
    },

    saveCustomAction() {
      const { name, parameters, body } = this.dataActionForm;
      this.eventSystem.registerCustomAction(name, new Function(...parameters, body));
      this.$root.logSystem.info(`Registered custom action.`);
      this.$root.dataActionForm = {
        name: '',
        nameNewParam: '',
        parameters: [],
        body: '',
      };
    },
  },
  watch: {
    dataActionForm(val) {
      this.$root.dataActionForm = val;
    },
  },
};
</script>