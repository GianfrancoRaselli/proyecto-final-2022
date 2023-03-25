<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="information mb-3">
      <div class="information-title">Información importante</div>
      <div class="information-info">
        <div>
          <fa-icon icon="angle-right" class="icon mr-2"></fa-icon
          ><span class="info"
            >Crear un nuevo fondo cuesta 1 FundToken. Por lo tanto, necesitas contar con dicho token en MetaMask, el cual será
            debitado automáticamente al crear el fondo.</span
          >
        </div>
        <div class="separator"></div>
        <div>
          <fa-icon icon="angle-right" class="icon mr-2"></fa-icon>
          <span class="info"
            >Todos los datos que ingreses a continuación serán almacenados en la cadena de bloques. Por lo tanto, no podrán ser
            modificados una vez creado el fondo.</span
          >
        </div>
      </div>
    </div>

    <!-- Fund Information -->
    <div class="fund-information">
      <div class="form-section">
        <span class="title">Información del fondo</span>
        <span class="step">Paso 1 de 3</span>
      </div>

      <div class="form-group">
        <label for="typeInput">Tipo</label>
        <div class="info-input">
          <select id="typeInput" class="form-control" v-model="data.type" :disabled="loading">
            <option v-for="(type, i) in types" :key="i" v-text="type.type" :value="type.value" :selected="type.selected"></option>
          </select>
          <div class="info">
            <fa-icon icon="question" class="icon" :class="{ 'icon-active': info.type }" @click="info.type = !info.type" />
            <div class="my-tooltip" v-if="info.type">
              Le ofrecemos la facilidad de seleccionar 3 tipos de fondos diferentes que vienen con diferentes parámetros ya
              configurados para su uso. En caso de querer una configuración al 100% puede optar por elegir un "fondo
              personalizado".
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="nameInput">Nombre</label>
        <div class="info-input">
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.data.name.$errors.length }"
            id="nameInput"
            aria-describedby="nameHelp"
            autofocus
            v-model="data.name"
            :disabled="loading"
          />
          <div class="info">
            <fa-icon icon="question" class="icon" :class="{ 'icon-active': info.name }" @click="info.name = !info.name" />
            <div class="my-tooltip" v-if="info.name">Nombre identificatorio del fondo.</div>
          </div>
        </div>
        <small id="nameHelp" class="form-text text-muted"></small>
        <AppInputErrors :errors="v$.data.name.$errors" />
      </div>

      <!-- Managers Information -->
      <div class="managers-information">
        <div class="form-section">
          <span class="title">Información de los administradores</span>
          <span class="step">Paso 2 de 3</span>
        </div>

        <div class="form-group">
          <div class="info-input">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="addMeAsAManagerInput"
                v-model="data.addMeAsAManager"
                :disabled="data.type === 'campaign' || data.type === 'donation' || loading"
              />
              <label class="custom-control-label" for="addMeAsAManagerInput">Agregarme como administrador</label>
            </div>
            <div class="info">
              <fa-icon
                icon="question"
                class="icon"
                :class="{ 'icon-active': info.addMeAsAManager }"
                @click="info.addMeAsAManager = !info.addMeAsAManager"
              />
              <div class="my-tooltip" v-if="info.addMeAsAManager">
                Un administrador podrá tener la facultad de: agregar y remover nuevos administradores, transferir dinero del fondo
                sin una solicitud previa, crear solicitudes de retiro de dinero, aprobar solicitudes sin haber aportado al fondo
                previamente.
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="managersInput">Administradores<span class="extra-info">Opcional</span></label>
          <div class="info-input">
            <textarea
              class="form-control"
              :class="{ 'is-invalid': v$.data.managers.$errors.length }"
              id="managersInput"
              rows="3"
              aria-describedby="managersHelp"
              v-model="data.managers"
              :disabled="loading"
            ></textarea>
            <div class="info">
              <fa-icon
                icon="question"
                class="icon"
                :class="{ 'icon-active': info.managers }"
                @click="info.managers = !info.managers"
              />
              <div class="my-tooltip" v-if="info.managers">
                Aquí puede agregar todos los administradores que desee, por ejemplo: 0x83bCaE28bdc13DA35617A1d648729CD373111dA9,
                0x3Df8Aea0789c1007E5e6F6876773A1dce65b41Be.
              </div>
            </div>
          </div>
          <small id="managersHelp" class="form-text text-muted"
            >Ingrese la dirección de otros administradores separados por coma (,)</small
          >
          <AppInputErrors :errors="v$.data.managers.$errors" />
        </div>

        <div class="form-group">
          <div class="info-input">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="managersCanBeAddedOrRemovedInput"
                v-model="data.managersCanBeAddedOrRemoved"
                :disabled="data.type !== '' || loading"
              />
              <label class="custom-control-label" for="managersCanBeAddedOrRemovedInput"
                >Los administradores pueden ser agregados o removidos</label
              >
            </div>
            <div class="info">
              <fa-icon
                icon="question"
                class="icon"
                :class="{ 'icon-active': info.managersCanBeAddedOrRemoved }"
                @click="info.managersCanBeAddedOrRemoved = !info.managersCanBeAddedOrRemoved"
              />
              <div class="my-tooltip" v-if="info.managersCanBeAddedOrRemoved">
                Si esta opción está activada los administradores agregados anteriormente podrán agregar o remover a nuevos
                administradores.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Requests Information -->
    <div class="requests-information">
      <div class="form-section">
        <span class="title">Información de las solicitudes</span>
        <span class="step">Paso 3 de 3</span>
      </div>

      <div class="form-group">
        <div class="info-input">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="managersCanTransferMoneyWithoutARequestInput"
              v-model="data.managersCanTransferMoneyWithoutARequest"
              :disabled="data.type !== '' || loading"
            />
            <label class="custom-control-label" for="managersCanTransferMoneyWithoutARequestInput"
              >Los administradores pueden transferir dinero sin una solicitud</label
            >
          </div>
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.managersCanTransferMoneyWithoutARequest }"
              @click="info.managersCanTransferMoneyWithoutARequest = !info.managersCanTransferMoneyWithoutARequest"
            />
            <div class="my-tooltip" v-if="info.managersCanTransferMoneyWithoutARequest">
              Si esta opción esta activada los administradores podrán transferir el dinero del fondo sin crear una solicitud
              previa.
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="info-input">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="requestsCanBeCreatedInput"
              v-model="data.requestsCanBeCreated"
              :disabled="data.type !== '' || loading"
            />
            <label class="custom-control-label" for="requestsCanBeCreatedInput">Las solicitudes pueden ser creadas</label>
          </div>
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.requestsCanBeCreated }"
              @click="info.requestsCanBeCreated = !info.requestsCanBeCreated"
            />
            <div class="my-tooltip" v-if="info.requestsCanBeCreated">
              Si esta opción esta activada estará habilitada la función de crear solicitudes para retirar dinero del fondo. En
              caso contrario, solo podrán retirar dinero los administradores.
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="info-input">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="onlyManagersCanCreateARequestInput"
              v-model="data.onlyManagersCanCreateARequest"
              :disabled="data.type !== '' || !data.requestsCanBeCreated || loading"
            />
            <label class="custom-control-label" for="onlyManagersCanCreateARequestInput"
              >Solo los administradores pueden crear una solicitud</label
            >
          </div>
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.onlyManagersCanCreateARequest }"
              @click="info.onlyManagersCanCreateARequest = !info.onlyManagersCanCreateARequest"
            />
            <div class="my-tooltip" v-if="info.onlyManagersCanCreateARequest">
              Si esta opción esta activada solo los administradores podrán crear solicitudes para retirar dinero del fondo. En
              caso contrario, cualquier entidad puede crear una solicitud que luego deberá ser aprobada para retirar el dinero.
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="info-input">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="onlyContributorsCanApproveARequestInput"
              v-model="data.onlyContributorsCanApproveARequest"
              :disabled="data.type !== '' || !data.requestsCanBeCreated || loading"
            />
            <label class="custom-control-label" for="onlyContributorsCanApproveARequestInput"
              >Solo los contribuyentes pueden aprobar una solicitud</label
            >
          </div>
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.onlyContributorsCanApproveARequest }"
              @click="info.onlyContributorsCanApproveARequest = !info.onlyContributorsCanApproveARequest"
            />
            <div class="my-tooltip" v-if="info.onlyContributorsCanApproveARequest">
              Si esta opción esta activada solo los contribuyentes del fondo podrán aprobar una solicitud de retiro de dinero. En
              caso contrario, los administradores también podrán hacerlo sin haber aportado al fondo previamente.
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="minimumContributionPercentageRequiredInput"
          >Mínimo porcentaje de contribución requerido para aprobar una solicitud</label
        >
        <input
          type="range"
          class="form-control-range"
          id="minimumContributionPercentageRequiredInput"
          v-model="data.minimumContributionPercentageRequired"
          :disabled="!data.requestsCanBeCreated || loading"
        />
      </div>

      <div class="form-group">
        <div class="info-input">
          <input
            type="string"
            class="form-control"
            :class="{ 'is-invalid': v$.data.minimumContributionPercentageRequired.$errors.length }"
            id="minimumContributionPercentageRequiredInput"
            aria-describedby="minimumContributionPercentageRequiredHelp"
            v-model="data.minimumContributionPercentageRequired"
            :disabled="!data.requestsCanBeCreated || loading"
          />
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.minimumContributionPercentageRequired }"
              @click="info.minimumContributionPercentageRequired = !info.minimumContributionPercentageRequired"
            />
            <div class="my-tooltip" v-if="info.minimumContributionPercentageRequired">
              Porcentaje mínimo de dinero que una entidad debe aportar al total historico de contribuciones del fondo para poder
              aprobar una solicitud de retiro de dinero.
            </div>
          </div>
        </div>
        <AppInputErrors :errors="v$.data.minimumContributionPercentageRequired.$errors" />
      </div>

      <div class="form-group">
        <label for="minimumApprovalsPercentageRequiredInput"
          >Mínimo porcentaje de aprobaciones requerido para finalizar una solicitud</label
        >
        <input
          type="range"
          class="form-control-range"
          id="minimumApprovalsPercentageRequiredInput"
          v-model="data.minimumApprovalsPercentageRequired"
          :disabled="!data.requestsCanBeCreated || loading"
        />
      </div>

      <div class="form-group">
        <div class="info-input">
          <input
            type="string"
            class="form-control"
            :class="{ 'is-invalid': v$.data.minimumApprovalsPercentageRequired.$errors.length }"
            id="minimumApprovalsPercentageRequiredInput"
            aria-describedby="minimumApprovalsPercentageRequiredHelp"
            v-model="data.minimumApprovalsPercentageRequired"
            :disabled="!data.requestsCanBeCreated || loading"
          />
          <div class="info">
            <fa-icon
              icon="question"
              class="icon"
              :class="{ 'icon-active': info.minimumApprovalsPercentageRequired }"
              @click="info.minimumApprovalsPercentageRequired = !info.minimumApprovalsPercentageRequired"
            />
            <div class="my-tooltip" v-if="info.minimumApprovalsPercentageRequired">
              Porcentaje mínimo de aprobaciones necesarias para que la entidad que creó una solicitud pueda finalmente retirar el
              dinero. El mismo se calcula en base a la cantidad de contibuyentes del fondo, sumado al número de administradores,
              en el caso que también estén habilitados para aprobar solicitudes.
            </div>
          </div>
        </div>
        <AppInputErrors :errors="v$.data.minimumApprovalsPercentageRequired.$errors" />
      </div>
    </div>

    <button type="submit" class="btn btn-primary" v-if="!loading">Crear fondo</button>
    <button class="btn btn-primary" type="button" disabled v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Creando...
    </button>
  </form>
</template>

<script>
import Web3 from 'web3';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, minLength, integer, minValue, maxValue } from '@vuelidate/validators';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { transaction, validateForm, removeInitialZeros } from '@/helpers/helpers';
import axios from 'axios';

export default {
  name: 'CreateFundFormComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loading: false,
      types: [
        {
          type: 'Fondo personalizado',
          value: '',
          selected: true,
        },
        {
          type: 'Fondo de amigos',
          value: 'friends',
          selected: false,
        },
        {
          type: 'Fondo de campaña',
          value: 'campaign',
          selected: false,
        },
        {
          type: 'Fondo de donación',
          value: 'donation',
          selected: false,
        },
      ],
      data: {
        type: '',
        name: '',
        addMeAsAManager: true,
        managers: '',
        managersCanBeAddedOrRemoved: true,
        managersCanTransferMoneyWithoutARequest: true,
        requestsCanBeCreated: true,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: 5,
        minimumApprovalsPercentageRequired: 50,
      },
      info: {
        type: false,
        name: false,
        addMeAsAManager: false,
        managers: false,
        managersCanBeAddedOrRemoved: false,
        managersCanTransferMoneyWithoutARequest: false,
        requestsCanBeCreated: false,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: false,
        minimumApprovalsPercentageRequired: false,
      },
    };
  },
  computed: {
    ...getMessages(['']),

    ...mapState({
      fundTokensBalance: (state) => state.connection.fundTokensBalance,
    }),
    ...mapGetters(['address']),
  },
  watch: {
    'data.type'(newValue) {
      switch (newValue) {
        case 'friends':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = false;
          this.data.onlyContributorsCanApproveARequest = false;
          this.data.minimumContributionPercentageRequired = 0;
          break;
        case 'campaign':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = false;
          this.data.managersCanTransferMoneyWithoutARequest = false;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
        case 'donation':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
      }
    },

    'data.requestsCanBeCreated'(newValue) {
      this.data.onlyManagersCanCreateARequest = false;
      this.data.onlyContributorsCanApproveARequest = false;
      if (newValue) {
        this.data.minimumContributionPercentageRequired = 5;
        this.data.minimumApprovalsPercentageRequired = 50;
      } else {
        this.data.minimumContributionPercentageRequired = 0;
        this.data.minimumApprovalsPercentageRequired = 0;
      }
    },

    'data.minimumContributionPercentageRequired'(newValue) {
      if (newValue) {
        this.data.minimumContributionPercentageRequired = newValue.replace(',', '.');
        this.data.minimumContributionPercentageRequired = removeInitialZeros(this.data.minimumContributionPercentageRequired);
      }
    },

    'data.minimumApprovalsPercentageRequired'(newValue) {
      if (newValue) {
        this.data.minimumApprovalsPercentageRequired = newValue.replace(',', '.');
        this.data.minimumApprovalsPercentageRequired = removeInitialZeros(this.data.minimumApprovalsPercentageRequired);
      }
    },
  },
  validations() {
    return {
      data: {
        name: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          minLength: helpers.withMessage('Debe ingresar al menos un carácter', minLength(1)),
        },
        managers: {
          mustBeAddresses: helpers.withMessage('Algún valor no es una dirección válida', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = value.split(',');
              addresses.forEach((address) => {
                if (!Web3.utils.isAddress(address.trim())) return (validation = false);
              });

              return validation;
            }
          }),

          mustNotBeMyAddress: helpers.withMessage('No puedes agregar tu propia dirección', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = value.split(',');
              addresses.forEach((address) => {
                if (compareAddresses(address.trim(), this.address)) return (validation = false);
              });

              return validation;
            }
          }),

          mustNotBeRepeated: helpers.withMessage('Las direcciones no pueden repetirse', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = value.split(',');
              addresses.forEach((address1) => {
                if (Web3.utils.isAddress(address1.trim())) {
                  if (address1.trim().toLowerCase() !== this.address.toLowerCase()) {
                    let count = 0;
                    addresses.forEach((address2) => {
                      if (compareAddresses(address1.trim(), address2.trim())) count++;
                    });
                    if (count > 1) return (validation = false);
                  }
                }
              });

              return validation;
            }
          }),
        },
        minimumContributionPercentageRequired: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          integer: helpers.withMessage('Debe ingresar un número entero', integer),
          minValue: helpers.withMessage('El valor mínimo permitido es 0', minValue(0)),
          maxValue: helpers.withMessage('El valor máximo permitido es 100', maxValue(100)),
        },
        minimumApprovalsPercentageRequired: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          integer: helpers.withMessage('Debe ingresar un número entero', integer),
          minValue: helpers.withMessage('El valor mínimo permitido es 0', minValue(0)),
          maxValue: helpers.withMessage('El valor máximo permitido es 100', maxValue(100)),
        },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const checkFundTokensBalance = () => {
        if (this.fundTokensBalance >= 1) {
          return true;
        } else {
          addNotification({
            message: 'Compra 1 FundToken para crear un nuevo fondo',
            type: 'error',
          });
          return false;
        }
      };

      const checkedFundTokensBalance = checkFundTokensBalance();
      const validatedForm = await validateForm(this.v$);

      if (checkedFundTokensBalance && validatedForm) {
        try {
          this.loading = true;
          const tx = await transaction(
            'FundFactory',
            'createFund',
            [
              this.data.name,
              this.getArrayOfManagers(),
              this.data.managersCanBeAddedOrRemoved,
              this.data.managersCanTransferMoneyWithoutARequest,
              this.data.requestsCanBeCreated,
              this.data.onlyManagersCanCreateARequest,
              this.data.onlyContributorsCanApproveARequest,
              this.data.minimumContributionPercentageRequired,
              this.data.minimumApprovalsPercentageRequired,
            ],
            undefined,
            true,
            `Nuevo fondo creado: ${this.data.name}`,
          );
          await axios.post('fund', {
            address: tx.events.NewFund.returnValues.fundAddress,
          });
          addNotification({
            message: 'Fondo desplegado a: ' + getSplitAddress(tx.events.NewFund.returnValues.fundAddress),
            type: 'success',
          });
          this.$router.push({
            name: 'Fund',
            params: { fundAddress: tx.events.NewFund.returnValues.fundAddress },
            query: { nuevo: 'si' },
          });
          this.data = {
            type: '',
            name: '',
            addMeAsAManager: true,
            managers: '',
            managersCanBeAddedOrRemoved: true,
            managersCanTransferMoneyWithoutARequest: true,
            requestsCanBeCreated: true,
            onlyManagersCanCreateARequest: false,
            onlyContributorsCanApproveARequest: false,
            minimumContributionPercentageRequired: 5,
            minimumApprovalsPercentageRequired: 50,
          };
        } finally {
          this.loading = false;
        }
      }
    },

    getArrayOfManagers() {
      let managers = [];
      if (this.data.addMeAsAManager) managers.push(this.address);
      const otherManagers = this.data.managers.split(',');
      otherManagers.forEach((manager) => {
        const managerAddress = manager.trim();
        if (Web3.utils.isAddress(managerAddress)) managers.push(managerAddress);
      });
      return managers;
    },
  },
};
</script>

<style lang="scss" scoped>
.information {
  padding: 1rem;
  border: 0.05px solid rgba(167, 167, 167, 0.296);
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 4px, rgba(0, 0, 0, 0.3) 0px 0px 2px;

  .information-title {
    font-size: 1.46rem;
    color: rgb(18, 18, 18);
    padding-right: 0.3rem;
    border-bottom: 0.1px solid rgb(135, 135, 135);
    border-right: 0.1px solid rgb(135, 135, 135);
    border-radius: 0 0 6px 0;
    display: inline-flex;
  }

  .information-info {
    margin-top: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.6rem;

    .info {
      font-size: 0.95rem;
      color: rgb(18, 18, 18);
    }

    .separator {
      height: 0.1px;
      background-color: rgb(199, 199, 199);
    }
  }
}

.form-section {
  color: rgb(62, 62, 62);
  margin-top: 26px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid rgba(110, 110, 110, 0.434);
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.form-section {
  .title {
    font-size: 1.2rem;
  }

  .step {
    font-size: 0.75rem;
    margin-left: auto;
  }
}

.info-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;

  .info {
    position: relative;

    .icon {
      user-select: none;
      height: 1.2rem;
      width: 1.2rem;
      font-size: 1.2rem;
      padding: 0.5rem;
      border-radius: 1.2rem;
      color: rgb(47, 47, 47);
    }

    .icon:hover {
      cursor: pointer;
      background-color: rgb(230, 230, 230);
    }

    .icon-active {
      background-color: rgb(208, 208, 208) !important;
    }

    .my-tooltip {
      word-wrap: break-word;
      word-break: break-word;
      position: absolute;
      top: 50%;
      right: 120%;
      transform: translateY(-50%);
      z-index: 200;
      height: auto;
      width: max-content;
      max-width: 35rem;
      color: rgb(255, 255, 255);
      background-color: rgb(50, 50, 50);
      padding: 0.5rem;
      border: 0.1px solid rgb(233, 233, 233);
      border-radius: 0.4rem;

      @media (max-width: 1000px) {
        max-width: 25rem;
      }

      @media (max-width: 450px) {
        max-width: 21rem;
      }

      @media (max-width: 370px) {
        max-width: 17rem;
      }

      @media (max-width: 325px) {
        max-width: 13rem;
      }
    }
  }
}
</style>
