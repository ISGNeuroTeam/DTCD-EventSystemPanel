<template>
  <button
    class="BtnBack"
    type="button"
    @click="$emit('click')"
  >
    <svg class="Icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5348 3.51514L7.0498 12.0001L15.5348 20.4851L16.9498 19.0711L9.87781 12.0001L16.9498 4.92914L15.5348 3.51514Z" fill="#0579F7"/>
    </svg>
    <span class="Text">Назад</span>
  </button>
</template>

<script>
export default {
  name: 'BtnBack',
};
</script>

<style lang="scss" scoped>
.BtnBack {
  display: inline-flex;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  .Icon {
    flex: none;
    fill: var(--button_primary);
  }

  .Text {
    display: inline-block;
    padding-left: 6px;
    font-weight: 600;
    color: var(--text_main);
  }
}
</style>