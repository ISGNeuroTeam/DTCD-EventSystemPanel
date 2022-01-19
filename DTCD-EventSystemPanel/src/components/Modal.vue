<template>
  <div class="overflow">
    <div class="modal">
      <div :is="type + 'Modal'" @close="$emit('close')"></div>
    </div>
  </div>
</template>

<script>
import CreateActionModal from "./CreateActionModal.vue";
import RemoveActionModal from "./RemoveActionModal.vue";

export default {
  props: ["type"],
  components: {
    CreateActionModal,
    RemoveActionModal,
  },
};
</script>

<style scoped>
.overflow {
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

	/* Modal position */
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal {
  width: auto;
  height: auto;
}

</style>