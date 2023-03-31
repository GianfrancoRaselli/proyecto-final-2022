<template>
  <div class="editor-container">
    <div class="header">
      <span class="title" v-text="title"></span>
    </div>
    <hr />
    <MyEditor
      :loading="loading"
      :toEdit="editing"
      :maxLength="maxLength"
      :allowSubmit="editing !== fund[propertyToEdit]"
      @close="$emit('showDisplay')"
      @change="(newValue) => (editing = newValue)"
      @submit="handleSubmit"
    />
    {{ propertyToEdit }}
  </div>
</template>

<script>
import axios from 'axios';
import { addNotification } from '@/composables/useNotifications';

import MyEditor from '@/components/MyEditor';

export default {
  name: 'FundExtraInformationEditorComponent',
  components: {
    MyEditor,
  },
  props: {
    title: { type: String, required: true },
    fund: { type: Object, required: true },
    propertyToEdit: { type: Boolean, required: true },
  },
  emits: ['showDisplay'],
  data() {
    return {
      loading: false,
      editing: '',
      maxLength: 100000,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        let body = {};
        body[this.propertyToEdit] = this.editing;
        await axios.put('fund/' + this.fund.address, body);
        // eslint-disable-next-line vue/no-mutating-props
        this.fund[this.propertyToEdit] = this.editing;
        addNotification({
          message: 'Edición guardada',
          type: 'success',
        });
        this.$emit('showDisplay');
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    if (this.fund[this.propertyToEdit]) this.editing = this.fund[this.propertyToEdit];
  },
};
</script>

<style lang="scss" scoped></style>
