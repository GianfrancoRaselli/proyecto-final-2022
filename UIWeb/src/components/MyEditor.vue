<template>
  <button class="btn btn-secondary mb-3" @click="$emit('close')">Cerrar edición</button>
  <vue-editor class="my-editor" :editorToolbar="customToolbar" :disabled="loading" v-model="editing"></vue-editor>
  <div class="length mt-2">
    <span class="mr-1"
      ><span class="number" :class="{ error: editingLength > maxLength }" v-text="separateInteger(editingLength)"></span>/<span
        class="number"
        v-text="separateInteger(maxLength)"
      ></span
    ></span>
    <FaIcon
      icon="question"
      class="icon"
      data-toggle="tooltip"
      data-placement="right"
      title=""
      data-original-title="El texto se convierte a formato HTML para ser guardado, por lo tanto, la longitud puede no coincidir con la cantidad de caracteres."
    />
  </div>
  <button type="button" class="btn btn-primary btn-block mt-3" @click="handleSubmit" :disabled="!allowSubmit" v-if="!loading">
    Guardar
  </button>
  <button class="btn btn-primary btn-block mt-3" type="button" disabled v-else>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Guardando...
  </button>
</template>

<script>
import $ from 'jquery';
import { separateInteger } from '@/helpers/helpers';
import { addNotification } from '@/composables/useNotifications';

import { VueEditor } from 'vue3-editor';

export default {
  name: 'MyEditorComponent',
  components: {
    VueEditor,
  },
  props: {
    loading: { type: Boolean, required: true },
    toEdit: { type: String, required: true },
    maxLength: { type: Number, required: true },
    allowSubmit: { type: Boolean, required: true },
  },
  emits: ['close', 'change', 'submit'],
  data() {
    return {
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
      editing: '',
    };
  },
  computed: {
    editingLength() {
      return this.editing.length;
    },
  },
  watch: {
    editing(newValue) {
      this.$emit('change', newValue);
    },
  },
  methods: {
    separateInteger,

    handleSubmit() {
      if (this.editingLength <= this.maxLength) {
        this.$emit('submit');
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

    this.editing = this.toEdit;
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

  .error {
    background-color: rgba(255, 206, 206, 0.756);
  }

  .icon {
    height: 1em;
    width: 1em;
    border: 0.1px solid grey;
    border-radius: 100%;
    padding: 0.2em;
  }
}
</style>
