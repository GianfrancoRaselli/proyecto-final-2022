<template>
  <div
    class="modal fade"
    id="editEntityImageImageModal"
    tabindex="-1"
    aria-labelledby="editEntityImageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="editEntityImageModalLabel">Actualizar imagen</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="imageInput">Imagen<span class="extra-info">Opcional</span></label>
              <input
                type="file"
                class="form-control-file"
                :class="{ 'is-invalid': v$.data.image.$errors.length }"
                id="imageInput"
                aria-describedby="imageHelp"
                @change="getFile"
                :disabled="loading"
              />
              <small id="imageHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.image.$errors" />
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Actualizar</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Actualizando...
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
  name: 'editEntityImageModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  components: {},
  props: {},
  emits: ['update'],
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
      data: {
        image: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          wrongFormat: helpers.withMessage('Formatos permitidos: JPEG, JPG y PNG', (value) => {
            if (!helpers.req(value)) return true;
            else {
              const format = value.name.split('.').pop();
              if (format === 'jpeg' || format === 'jpg' || format === 'png') return true;
              return false;
            }
          }),
        },
      },
    };
  },
  methods: {
    getFile(e) {
      this.data.image = e.target.files[0];
    },

    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;

          if (!this.signature) await signMessage();

          let formData = new FormData();
          formData.append('image', this.data.image);
          await axios.put('entity/uploadImage', formData);

          this.$emit('update');
          addNotification({
            message: 'Imagen actualizada',
            type: 'success',
          });
          $('#editEntityImageModal').modal('hide');
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
