<template>
  <div class="editor-container">
    <vue-editor class="editor" :editorToolbar="customToolbar" :disabled="loading" v-model="editing"></vue-editor>
    <button
      type="button"
      class="btn btn-primary btn-block mt-3"
      @click="handleSumbit"
      :disabled="editing === fund[propertyToEdit]"
      v-if="!loading"
    >
      Guardar
    </button>
    <button class="btn btn-primary btn-block mt-3" type="button" disabled v-else>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Guardando...
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import { addNotification } from '@/composables/useNotifications';
import { VueEditor } from 'vue3-editor';

export default {
  name: 'FundExtraInformationEditorComponent',
  components: {
    VueEditor,
  },
  props: {
    fund: { type: Object, required: true },
    propertyToEdit: { type: Boolean, required: true },
  },
  data() {
    return {
      loading: false,
      editing: '',
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link' /*, 'image', 'video'*/],
        ['clean'],
      ],
    };
  },
  computed: {},
  methods: {
    async handleSumbit() {
      console.log(this.editing);
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
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.editing = this.fund[this.propertyToEdit];
  },
};
</script>

<style lang="scss" scoped></style>
