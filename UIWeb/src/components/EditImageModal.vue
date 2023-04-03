<template>
  <div
    class="modal fade"
    :id="!editImages ? 'editImageModal' : 'addImageModal'"
    tabindex="-1"
    :aria-labelledby="!editImages ? 'editImageModalLabel' : 'addImageModalLabel'"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4
            class="modal-title"
            :id="!editImages ? 'editImageModalLabel' : 'addImageModalLabel'"
            v-text="!editImages ? 'Actualizar imagen' : 'Agregar imagen'"
          ></h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <input
                type="file"
                class="form-control-file"
                :class="{ 'is-invalid': v$.image.$errors.length }"
                id="imageInput"
                ref="imageInput"
                aria-describedby="imageHelp"
                @change="getFile"
                :disabled="loading"
              />
              <small id="imageHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.image.$errors" />
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              v-if="!loading"
              v-text="!editImages ? 'Actualizar' : 'Agregar'"
            ></button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ !editImages ? 'Actualizando...' : 'Agregando...' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapState } from 'vuex';
import { signMessage } from '@/helpers/connection';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { validateForm } from '@/helpers/helpers';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

export default {
  name: 'editImageModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  components: {},
  props: {
    fundAddress: { type: String, default: undefined },
    editImages: { type: Boolean, default: false },
  },
  emits: ['submit'],
  data() {
    return {
      loading: false,
      image: undefined,
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
  },
  watch: {},
  validations() {
    return {
      image: {
        required: helpers.withMessage('Debe seleccionar una imagen', required),
        wrongFormat: helpers.withMessage('Formatos permitidos: JPEG, JPG y PNG', (value) => {
          const format = value.name.split('.').pop();
          if (format === 'jpeg' || format === 'jpg' || format === 'png') return true;
          return false;
        }),
      },
    };
  },
  methods: {
    getFile(e) {
      this.image = e.target.files[0];
    },

    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;

          if (!this.signature) await signMessage();

          let formData = new FormData();
          formData.append('image', this.image);

          let imageName;
          if (this.editImages) {
            const { data } = await axios.put('fund/uploadImageToImages/' + this.fundAddress, formData);
            imageName = data.images[data.images.length - 1];
          } else {
            if (!this.fundAddress) imageName = (await axios.put('entity/uploadImage', formData)).data.image;
            else imageName = (await axios.put('fund/uploadImage/' + this.fundAddress, formData)).data.image;
          }

          this.$emit('submit', imageName);
          addNotification({
            message: !this.editImages ? 'Imagen actualizada' : 'Imagen agregada',
            type: 'success',
          });
          $(!this.editImages ? '#editImageModal' : '#addImageModal').modal('hide');
          this.$refs['imageInput'].value = '';
          this.image = undefined;
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
