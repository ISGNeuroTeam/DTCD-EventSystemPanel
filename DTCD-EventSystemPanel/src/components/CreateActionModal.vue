<template>
  <div class="container">
    <div class="form">
      <base-input
        class="action-name-input"
        required
        placeholder="Название действия"
        @input="(e) => (temp.name = e.target.value)"
      ></base-input>

      <div class="add-parameters-container">
        <base-input
          placeholder="param1"
          label="Имя параметра"
          ref="paramNameInput"
          @input="(e) => (newParamTemp = e.target.value)"
        ></base-input>

        <svg
          class="add-parameter-button"
          xmlns="http://www.w3.org/2000/svg"
          @click="addNewParameter"
        >
          <path
            d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"
          />
        </svg>
      </div>

      <div class="parameter-list">
        <base-chip
          close="remove"
          v-for="(param, index) in temp.parameters"
          @remove="removeParameter(index)"
          :key="index"
          >{{ param }}</base-chip
        >
      </div>

      <base-textarea
        class="action-callback-body-textarea"
        required
        placeholder="Тело JS-функции"
        @input="(e) => (temp.body = e.target.value)"
      ></base-textarea>
    </div>

    <div class="footer">
      <base-button @click="saveCustomAction">Сохранить</base-button>
      <base-button
        @click="temp = { name: '', parameters: [], body: '' } && $emit('close')"
        >Отменить</base-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateActionModal",
  data() {
    return {
      temp: { name: "", parameters: [], body: "" },
      newParamTemp: "",
    };
  },
  methods: {
    addNewParameter() {
      if (this.$refs.paramNameInput.value) {
        this.temp.parameters.push(this.$refs.paramNameInput.value);
        this.$refs.paramNameInput.value = "";
      }
    },
    removeParameter(index) {
      this.temp.parameters.splice(index, 1);
    },
    saveCustomAction() {
      const { name, parameters, body } = this.temp;

      this.$root.pluginInstance
        .getSystem("EventSystem", "0.3.0")
        .registerAction("", name, new Function(...parameters, body));
      this.temp = {};
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.form {
  margin: 10px;
}

.container {
  display: flex;
  flex-flow: column wrap;
  background-color: var(--background_main);
  max-width: 400px;
  padding: 10px;
}

.action-name-input {
  padding: 10px;
}

.add-parameters-container {
  display: flex;
  align-items: center;
}

.add-parameter-button {
  cursor: pointer;
  margin-top: 13px;
  width: 25px;
  height: 25px;
}

.footer {
  align-self: flex-end;
}
</style>
