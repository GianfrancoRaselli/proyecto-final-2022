<template>
  <div class="editor-container">
    <vue-editor class="editor" :editorToolbar="customToolbar" :disabled="loading" v-model="editing"></vue-editor>
    <div class="length mt-2">
      <span class="mr-1"><span class="number" v-text="editingLength"></span>/<span class="number">100.000</span></span>
      <fa-icon
        icon="question"
        class="icon"
        data-toggle="tooltip"
        data-placement="right"
        title=""
        data-original-title="El texto se convierte a formato HTML para ser guardado, por lo tanto, la longitud puede no coincidir con la cantidad de caracteres."
      />
    </div>
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
import $ from 'jquery';
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
  computed: {
    editingLength() {
      return this.editing.length;
    },
  },
  methods: {
    async handleSumbit() {
      if (this.editingLength <= 100000) {
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
      } else {
        addNotification({
          message: 'Corrige la longitud del texto',
          type: 'error',
        });
      }
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    if (this.fund[this.propertyToEdit]) this.editing = this.fund[this.propertyToEdit];
  },
};
</script>

<style lang="scss" scoped>
.length {
  font-size: 0.85rem;
  color: gray;
  display: flex;
  flex-direction: row;
  align-items: center;

  .number {
    padding: 0 0.1em;
  }
}

.icon {
  height: 1em;
  width: 1em;
  border: 0.1px solid grey;
  border-radius: 100%;
  padding: 0.2em;
}
</style>
