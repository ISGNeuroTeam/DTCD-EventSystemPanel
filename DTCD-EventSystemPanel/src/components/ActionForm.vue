<template>
  <div class="Wrapper">
    <div class="Header">
      <base-heading theme="theme_subheaderSmall">
        <h4>
          {{
            currentSubscription
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
          required="true"
          size="big"
          :value="temp.name"
          @input="(e) => (temp.name = e.target.value)"
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
          <svg class="Icon" id="plus-circle" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 33C9.7195 32.9909 3.00909 26.2805 3 18V17.7C3.1649 9.45682 9.95188 2.89196 18.196 3.00135C26.4401 3.11073 33.0505 9.85336 32.9967 18.098C32.9428 26.3427 26.2449 32.9984 18 33ZM10.5 16.5V19.5H16.5V25.5H19.5V19.5H25.5V16.5H19.5V10.5H16.5V16.5H10.5Z" fill="#069AEE"/>
          </svg>
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
          required="true"
          placeholder="Тело JS-функции"
          size="big"
          :value="temp.body"
          @input="(e) => (temp.body = e.target.value)"
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
  </div>
</template>

<script>
import BtnBack from './BtnBack';

export default {
  name: 'ActionForm',
  components: {
    BtnBack,
  },
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
  methods: {
    handleSubmitBtnClick(event) {
      event.preventDefault();
      this.saveCustomAction();
      this.toggleWindow();
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