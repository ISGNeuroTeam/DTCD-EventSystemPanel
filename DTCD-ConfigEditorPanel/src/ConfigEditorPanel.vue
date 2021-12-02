<template>
  <div class="container">
    <div>
      Режим слежения
      <input type="checkbox" v-model="watchMode" />
    </div>
    <h1>{{ title }}</h1>
    <h4>{{ subtitle }}</h4>
    <FormSection v-for="(section, idx) of sections" :key="idx" :sectionData="section" :temp="temp[section.key]" :tempKey="section.key"/>
  </div>
</template>

<script>
import FormSection from './components/FormSection.vue';

export default {
    name: "ConfigEditorPanel",
    data() {
        return {
            temp: {},
            watchMode: true,
            title: "Настройки компонента",
            subtitle: "",
            sections: [],
        };
    },
    watch: {
        watchMode(newVal) {
            this.$root.pluginInstance.setWatchingMode(newVal);
        }
    },
    methods: {
        render(config) {
            const { title = "Настройки компонента", subtitle = "", sections } = config;
            this.title = title;
            sections.forEach(section => {
                this.temp[section.key] = {};
            });
            this.sections = sections;
            console.log(this.sections);
            this.subtitle = subtitle;
        },
    },
    components: { FormSection }
};
</script>

<style lang="sass" scoped></style>
