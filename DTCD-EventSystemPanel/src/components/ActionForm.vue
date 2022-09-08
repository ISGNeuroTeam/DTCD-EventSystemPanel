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
        <BtnBack @click="() => toggleWindow()"/>
      </div>

      <div class="FieldContainer">
        <base-input
          label="Название действия"
          required
          size="big"
          :value="temp.name"
          @input="(e) => (temp.name = e.target.value)"
          :invalid="$v.temp.name.$dirty && $v.temp.name.$invalid"
        ></base-input>
      </div>

      <div class="FieldContainer type_params">
        <base-input 
          label="Имя параметра"
          size="big"
          :value="newParamTemp"
          @input="(e) => (newParamTemp = e.target.value)"
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
          v-for="(param, index) in temp.parameters"
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
          :value="temp.body"
          @input="(e) => (temp.body = e.target.value)"
          :invalid="$v.temp.body.$dirty && $v.temp.body.$invalid"
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
    'toggleWindow',
    'currentAction',
  ],
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      temp: {
        name: this.currentAction ? this.currentAction.name : '',
        parameters: [],
        body: this.currentAction ? this.currentAction.body : '',
      },
      newParamTemp: '',
    };
  },
  validations() {
    return {
      temp: {
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
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveCustomAction();
        this.toggleWindow();
      }
    },

    handleDeleteBtnClick(event) {
      event.preventDefault();
      this.eventSystem.removeCustomAction(this.temp.name);
      this.toggleWindow();
    },

    addNewParameter() {
      if (this.newParamTemp) {
        this.temp.parameters.push(this.newParamTemp);
        this.newParamTemp = '';
      }
    },

    removeParameter(index) {
      this.temp.parameters.splice(index, 1);
    },

    saveCustomAction() {
      const { name, parameters, body } = this.temp;
      this.eventSystem.registerCustomAction(name, new Function(...parameters, body));
      this.temp = {};
    },
  },
};
</script>