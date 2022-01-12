<template>
  <div>
    <div
      class="subscription-container"
      v-for="(sub, index) in subscriptions"
      :key="index"
    >
      <Subscription :subscription="sub" />
    </div>
    <div class="new-subscription">
      <base-select ref="eventSelect" required
        ><div slot="item" v-for="evt in events" :key="evt.id" :value="evt">
          <div class="plugin-info-container">
            <div class="plugin-name">
              {{
                plugin.getInstance
                  .call(null, evt.guid)
                  .constructor.getRegistrationMeta().name
              }}
            </div>
            <div class="plugin-guid">
              {{ evt.guid }}
            </div>
          </div>
          <div>
            {{ evt.name }}
          </div>
        </div></base-select
      >
      <base-select ref="actionSelect" required
        ><div slot="item" v-for="act in actions" :key="act.id" :value="act">
          <div class="plugin-info-container">
            <div class="plugin-name">
              {{
                plugin.getInstance
                  .call(null, act.guid)
                  .constructor.getRegistrationMeta().name
              }}
            </div>
            <div class="plugin-guid">
              {{ act.guid }}
            </div>
          </div>
          <div>
            {{ act.name }}
          </div>
        </div></base-select
      >
      <svg
        class="add-subscription-button"
        @click="subscribe"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import Subscription from "./Subscription.vue";

export default {
  name: "EventSystemPanel",
  components: {
    Subscription,
  },
  data() {
    return {
      eventSystem: this.$root.eventSystem,
      plugin: this.$root.pluginInstance,
      subscriptions: [],
      events: [],
      actions: [],
    };
  },
  mounted() {
    this.subscriptions = this.eventSystem.subscriptions;
    this.events = this.eventSystem.events;
    this.actions = this.eventSystem.actions;
  },
  methods: {
    subscribe() {
      this.$refs.eventSelect.validate();
      const event = this.eventSystem.events.find(
        (evt) => evt.id === this.$refs.eventSelect.value
      );
      const action = this.eventSystem.actions.find(
        (act) => act.id === this.$refs.actionSelect.value
      );
      this.eventSystem.subscribe(
        event.guid,
        event.name,
        action.guid,
        action.name
      );
    },
  },
};
</script>

<style>
.subscription-container {
  margin: 10px;
}

.new-subscription {
  display: flex;
  justify-content: space-around;
  height: 25px;
}
.new-subscription > * {
  margin-left: 10px;
}

[slot="item"] {
  height: 100%;
}

.plugin-info-container {
  font-size: 10px;
}

.add-subscription-button {
  justify-self: baseline;
  cursor: pointer;
  padding: 5px;
  border-radius: 16px;
  width: 60px;
  height: 100%;
}

.add-subscription-button:hover {
  background-color: var(--background_secondary);
}

base-select {
  height: 100%;
  width: 100%;
}
</style>