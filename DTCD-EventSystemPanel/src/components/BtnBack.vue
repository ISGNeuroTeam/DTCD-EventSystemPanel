<template>
  <button
    class="BtnBack"
    type="button"
    @click="$emit('click')"
  >
    <span class="Icon FontIcon name_chevronBigDown rotate_90 size_md "></span>
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

  .FontIcon {
    flex: none;
    color: var(--button_primary);
  }

  .Text {
    display: inline-block;
    padding-left: 6px;
    font-weight: 600;
    color: var(--text_main);
  }
}
</style>