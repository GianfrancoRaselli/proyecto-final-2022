<template>
  <div class="modal fade" id="editEntityModal" tabindex="-1" aria-labelledby="editEntityModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="editEntityModalLabel">{{ entity ? 'Editar entidad' : 'Crear entidad' }}</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="fullnameInput">Nombre completo</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.fullname.$errors.length }"
                id="fullnameInput"
                aria-describedby="fullnameHelp"
                autofocus
                v-model="data.fullname"
                :disabled="loading"
              />
              <small id="fullnameHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.fullname.$errors" />
            </div>

            <div class="form-group">
              <label for="typeInput">Tipo</label>
              <select id="typeInput" class="form-control" v-model="data.type" :disabled="loading">
                <option v-for="(type, i) in types" :key="i" v-text="type" :value="type"></option>
              </select>
            </div>

            <div class="form-group">
              <label for="descriptionInput">Descripción</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': v$.data.description.$errors.length }"
                id="descriptionInput"
                rows="5"
                aria-describedby="descriptionHelp"
                v-model="data.description"
                :disabled="loading"
              ></textarea>
              <small id="descriptionHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.description.$errors" />
            </div>

            <div class="form-group">
              <label for="emailInput">Correo electrónico</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.email.$errors.length }"
                id="emailInput"
                aria-describedby="emailHelp"
                v-model="data.email"
                :disabled="loading"
              />
              <small id="emailHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.email.$errors" />
            </div>

            <div class="form-group">
              <label for="phoneInput">Teléfono</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.phone.$errors.length }"
                id="phoneInput"
                aria-describedby="phoneHelp"
                v-model="data.phone"
                :disabled="loading"
              />
              <small id="phoneHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.phone.$errors" />
            </div>

            <div class="form-row">
              <div class="col-6">
                <div class="form-group">
                  <label for="contributionAmountInput">País</label>
                  <country-select
                    class="form-control"
                    :class="{ 'is-invalid': v$.data.country.$errors.length }"
                    id="countryInput"
                    :disabled="loading"
                    v-model="data.country"
                    :country="data.country"
                    topCountry="Argentina"
                    :removePlaceholder="true"
                    :countryName="true"
                  />
                  <AppInputErrors :errors="v$.data.country.$errors" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="contributionUnitInput">Región</label>
                  <region-select
                    class="form-control"
                    :class="{ 'is-invalid': v$.data.region.$errors.length }"
                    id="regionInput"
                    :disabled="loading"
                    v-model="data.region"
                    :country="data.country"
                    :region="data.region"
                    :removePlaceholder="true"
                    :countryName="true"
                    :regionName="true"
                  />
                  <AppInputErrors :errors="v$.data.region.$errors" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="urlInput">Sitio Web<span class="extra-info">Opcional</span></label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.url.$errors.length }"
                id="urlInput"
                aria-describedby="urlHelp"
                v-model="data.url"
                :disabled="loading"
              />
              <small id="urlHelp" class="form-text text-muted"></small>
              <AppInputErrors :errors="v$.data.url.$errors" />
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
import { helpers, required, minLength, maxLength, email, url } from '@vuelidate/validators';
import { validateForm } from '@/helpers/helpers';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

export default {
  name: 'EditEntityModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  components: {},
  props: {
    entity: { type: Object, required: true },
  },
  emits: ['update'],
  data() {
    return {
      loading: false,
      types: ['Persona', 'Empresa', 'Organización'],
      data: {
        fullname: '',
        type: 'Persona',
        description: '',
        email: '',
        phone: '',
        country: '',
        region: '',
        url: '',
      },
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
  },
  watch: {
    entity(newValue) {
      if (newValue) {
        const { country, region, newValueWithoutLocation } = newValue;
        this.data = {
          ...newValueWithoutLocation,
        };
        this.data.country = country;
        setTimeout(() => (this.data.region = region), 10);
      } else {
        this.data.type = 'Persona';
        this.data.country = 'Argentina';
        setTimeout(() => (this.data.region = 'Buenos Aires'), 10);
      }
    },
  },
  validations() {
    return {
      data: {
        fullname: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          minLength: helpers.withMessage('La cantidad mínima de caracteres permitidos es 2', minLength(2)),
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 80', maxLength(80)),
        },
        description: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 1000', maxLength(1000)),
        },
        email: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 80', maxLength(80)),
          email: helpers.withMessage('Debe ingresar un correo electrónico válido', email),
        },
        phone: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 50', maxLength(50)),
        },
        country: {
          required: helpers.withMessage('Debe seleccionar un valor', required),
        },
        region: {
          required: helpers.withMessage('Debe seleccionar un valor', required),
        },
        url: {
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 320', maxLength(320)),
          url: helpers.withMessage('Debe ingresar una URL válida', url),
        },
      },
    };
  },
  methods: {
    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;

          if (!this.signature) await signMessage();

          await axios[this.entity ? 'put' : 'post']('entity', {
            fullname: this.data.fullname,
            type: this.data.type,
            description: this.data.description,
            email: this.data.email,
            phone: this.data.phone,
            country: this.data.country,
            region: this.data.region,
            url: this.data.url,
          });

          this.$emit('update');
          this.emitter.emit('update-entity-name');
          addNotification({
            message: 'Información guardada',
            type: 'success',
          });
          $('#editEntityModal').modal('hide');
        } finally {
          this.loading = false;
        }
      }
    },
  },
  mounted() {
    this.data.country = 'Argentina';
    setTimeout(() => (this.data.region = 'Buenos Aires'), 10);
  },
};
</script>

<style lang="scss" scoped></style>
