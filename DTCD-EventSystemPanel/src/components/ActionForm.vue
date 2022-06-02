<template>
  <div class="Wrapper">
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