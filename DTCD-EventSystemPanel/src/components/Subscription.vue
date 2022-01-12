<template>
  <div class="container">
    <div class="subscription-info">
      <div class="event-info">
        <i>Cобытие:</i>
        {{
          plugin.getInstance
            .call(null, subscription.event.guid)
            .constructor.getRegistrationMeta().name
        }}
        ({{ subscription.event.guid }})
        <b>{{ subscription.event.name }}</b>
      </div>
      <div class="action-info">
        <i>Действие:</i>
        {{
          plugin.getInstance
            .call(null, subscription.action.guid)
            .constructor.getRegistrationMeta().name
        }}
        ({{ subscription.action.guid }})
        <b>{{ subscription.action.name }}</b>
      </div>
    </div>
    <svg
      class="button-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="deleteSubscription"
    >
      <path
        d="M12.75 16.5H5.25C4.42157 16.5 3.75 15.8284 3.75 15V5.25H2.25V3.75H5.25V3C5.25 2.17157 5.92157 1.5 6.75 1.5H11.25C12.0784 1.5 12.75 2.17157 12.75 3V3.75H15.75V5.25H14.25V15C14.25 15.8284 13.5784 16.5 12.75 16.5ZM5.25 5.25V15H12.75V5.25H5.25ZM6.75 3V3.75H11.25V3H6.75ZM11.25 13.5H9.75V6.75H11.25V13.5ZM8.25 13.5H6.75V6.75H8.25V13.5Z"
        fill="#000"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Subscription",
  props: ["subscription"],
  data() {
    return { plugin: this.$root.pluginInstance };
  },
  methods: {
    deleteSubscription() {
      const {
        event: { guid: eventGUID, name: eventName },
        action: { guid: actionGUID, name: actionName },
      } = this.subscription;
      this.$root.eventSystem.unsubscribe(
        eventGUID,
        eventName,
        actionGUID,
        actionName
      );
    },
  },
};
</script>

<style scoped>
.container {
  border: 1px solid black;
  border-radius: 3px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.button-icon{
	justify-self: baseline;
	cursor: pointer;
	padding: 10px;
	border-radius: 16px;
}

.button-icon:hover{
	background-color: var(--background_secondary);
}

.subscription-info {
  display: flex;
  flex-direction: column;
}
</style>