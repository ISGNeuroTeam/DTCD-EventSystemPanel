<template>
  <div>
    <component :is="fieldMap[fieldSettings.type]"></component>
  </div>
</template>

<script>
import { TextField, TextareaField, CheckboxField, DataSourcePicker } from './fields';

import fieldMap from './fields';

export default {
  name: 'FormField',
  props: ['fieldSettings', 'sectionTemp', 'fieldKeyInSection'],
	data() {
		return {
			fieldMap
		}
	},
  components: {
    TextField,
    TextareaField,
    CheckboxField,
    DataSourcePicker,
  },
};
</script>

<style></style>
