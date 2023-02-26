<template>
  <div class="modal fade" id="createFundModal" tabindex="-1" aria-labelledby="createFundModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="createFundModalLabel">Crear fondo</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="question">¿Desea agregar una descripción y una imagen al nuevo fondo creado?</p>
          <p class="information">
            Esta información se almacenará fuera de la cadena de bloques, por lo que no le constará ningún Ether.
          </p>
          <hr />
          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="descriptionInput">Descripción</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': v$.data.description.$errors.length }"
                id="descriptionInput"
                rows="3"
                aria-describedby="descriptionHelp"
                v-model="data.description"
                :disabled="loading"
              ></textarea>
              <small id="descriptionHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.description.$errors" />
            </div>

            <div class="form-group">
              <label for="imageInput">Imagen</label>
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

            <button type="submit" class="btn btn-primary" v-if="!loading">Guardar</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Guardando...
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
import { helpers } from '@vuelidate/validators';
import { validateForm } from '@/helpers/helpers';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

export default {
  name: 'CreateFundModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: false,
      data: {
        description: '',
        image: undefined,
      },
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
  },
  validations() {
    return {
      data: {
        description: {
          required: helpers.withMessage('Debe ingresar un valor', (value) => {
            if (value) return true;
            else return false;
          }),
          minLength: helpers.withMessage('La cantidad mínima de caracteres permitidos es 1', (value) => {
            if (value.length >= 1) return true;
            else return false;
          }),
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 1000', (value) => {
            if (value.length <= 1000) return true;
            else return false;
          }),
        },
        image: {
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

          await axios.post('fund', {
            address: this.fund.address,
            description: this.data.description,
          });

          let formData = new FormData();
          formData.append('image', this.data.image);
          await axios.put('fund/uploadImage/' + this.fund.address, formData);

          addNotification({
            message: 'Información guardada',
            type: 'success',
          });
          $('#createFundModal').modal('hide');
          this.$router.replace({ query: null });
          this.data = {
            description: '',
            image: undefined,
          };
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-body {
  .question {
    text-align: center;
    font-size: 1.1rem;
  }

  .information {
    text-align: center;
    font-size: 0.9rem;
  }
}
</style>
