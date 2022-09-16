<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :id="name"
      :name="name"
      :label="label"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      class="form-input"
      v-bind="$attrs"
      :aria-describedby="helpId"
    />
    <small :id="helpId" class="form-text text-muted">{{ helpText }}</small>
    <VeeErrorMessage :name="name" class="form-error" />
  </div>
</template>
<script>
export default {
  name: 'AppFormFieldComponent',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    name: { type: String, required: true },
    modelValue: { type: String, required: true },
    helpId: { type: String, default: '' },
    helpText: { type: String, default: '' },
  },
};
</script>
