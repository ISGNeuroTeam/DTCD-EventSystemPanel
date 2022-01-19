<template>
  <div class="container">
    <table v-if="actions.length" border="var(--border)">
      <tr>
        <th>Название</th>
        <th></th>
      </tr>
      <tr
      class="action-row"
        v-for="(action, index) in actions.filter((act) => !act.guid)"
        :key="index"
      >
        <td>{{ action.name }}</td>
        <td
          @click="$root.eventSystem.removeCustomAction(action.name)"
          style="cursor: pointer;display:flex;justify-content:center;"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 16.5H5.25C4.42157 16.5 3.75 15.8284 3.75 15V5.25H2.25V3.75H5.25V3C5.25 2.17157 5.92157 1.5 6.75 1.5H11.25C12.0784 1.5 12.75 2.17157 12.75 3V3.75H15.75V5.25H14.25V15C14.25 15.8284 13.5784 16.5 12.75 16.5ZM5.25 5.25V15H12.75V5.25H5.25ZM6.75 3V3.75H11.25V3H6.75ZM11.25 13.5H9.75V6.75H11.25V13.5ZM8.25 13.5H6.75V6.75H8.25V13.5Z"
              fill="#000"
            />
          </svg>
        </td>
      </tr>
    </table>
    <base-button @click="$emit('close')">Закрыть</base-button>
  </div>
</template>

<script>
export default {
  name: "RemoveActionModal",
  data() {
    return {
      temp: {},
      actions: this.$root.eventSystem.actions,
    };
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
  min-width: 400px;
  padding: 10px;
}

.footer {
  align-self: flex-end;
}
</style>