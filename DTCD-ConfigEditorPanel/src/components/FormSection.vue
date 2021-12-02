<template>
  <div class="container">
    <h3>
      {{ sectionData.title }}
    </h3>
    <div v-if="sectionData.type === 'dataSource'">
      <select v-model="temp[tempKey]">
        <option
          v-for="name of Object.keys($root.dataSourceSystem.getDataSourceList())"
          :key="name"
          :value="name"
        >
          {{ name }}
        </option>
      </select>
    </div>
    <div v-else-if="sectionData.type === 'list'">
      <FormField
        v-for="(fieldSettings, idx) of sectionData.fields"
        :key="idx"
        :fieldSettings="fieldSettings"
        :sectionTemp="temp"
        :fieldKeyInSection="idx"
      ></FormField>
    </div>
    <div v-else>
      <FormField
        v-for="(fieldSettings, idx) of sectionData.fields"
        :key="idx"
        :fieldSettings="fieldSettings"
        :fieldKeyInSection="fieldSettings.key"
      ></FormField>
    </div>
  </div>
</template>

<script>
import FormField from './FormField.vue';
export default {
  name: 'FormSection',
  props: ['sectionData', 'temp', 'tempKey'],
  data() {
    return {};
  },
  components: {
    FormField,
  },
};
</script>

<style></style>
