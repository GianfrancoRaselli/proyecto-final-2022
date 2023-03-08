<template>
  <div class="container">
    <form class="form" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <span class="h2">Crear fondo</span>
      </div>

      <div class="fund-token-info mb-3">
        <fa-icon icon="circle-info" class="icon"></fa-icon><span class="info">Crear un nuevo fondo cuesta 1 FundToken</span>
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
              <option
                v-for="(type, i) in types"
                :key="i"
                v-text="type.type"
                :value="type.value"
                :selected="type.selected"
              ></option>
            </select>
            <div class="info">
              <fa-icon
                icon="question"
                class="icon"
                @mouseover="info.type.mouse = true"
                @mouseleave="info.type.mouse = false"
                @click="info.type.click = !info.type.click"
              />
              <div class="my-tooltip" v-if="info.type.mouse || info.type.click">isdjksdsdkssdkdskds koas dko sadkosd</div>
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
              <fa-icon
                icon="question"
                class="icon"
                @mouseover="info.name.mouse = true"
                @mouseleave="info.name.mouse = false"
                @click="info.name.click = !info.name.click"
              />
              <div class="my-tooltip" v-if="info.name.mouse || info.name.click">isdjksdsdkssdkdskds koas dko sadkosd</div>
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
                  @mouseover="info.addMeAsAManager.mouse = true"
                  @mouseleave="info.addMeAsAManager.mouse = false"
                  @click="info.addMeAsAManager.click = !info.addMeAsAManager.click"
                />
                <div class="my-tooltip" v-if="info.addMeAsAManager.mouse || info.addMeAsAManager.click">
                  isdjksdsdkssdkdskds koas dko sadkosd
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
                  @mouseover="info.managers.mouse = true"
                  @mouseleave="info.managers.mouse = false"
                  @click="info.managers.click = !info.managers.click"
                />
                <div class="my-tooltip" v-if="info.managers.mouse || info.managers.click">
                  isdjksdsdkssdkdskds koas dko sadkosd
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
                  @mouseover="info.managersCanBeAddedOrRemoved.mouse = true"
                  @mouseleave="info.managersCanBeAddedOrRemoved.mouse = false"
                  @click="info.managersCanBeAddedOrRemoved.click = !info.managersCanBeAddedOrRemoved.click"
                />
                <div class="my-tooltip" v-if="info.managersCanBeAddedOrRemoved.mouse || info.managersCanBeAddedOrRemoved.click">
                  isdjksdsdkssdkdskds koas dko sadkosd
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
                @mouseover="info.managersCanTransferMoneyWithoutARequest.mouse = true"
                @mouseleave="info.managersCanTransferMoneyWithoutARequest.mouse = false"
                @click="info.managersCanTransferMoneyWithoutARequest.click = !info.managersCanTransferMoneyWithoutARequest.click"
              />
              <div
                class="my-tooltip"
                v-if="info.managersCanTransferMoneyWithoutARequest.mouse || info.managersCanTransferMoneyWithoutARequest.click"
              >
                isdjksdsdkssdkdskds koas dko sadkosd
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
                @mouseover="info.requestsCanBeCreated.mouse = true"
                @mouseleave="info.requestsCanBeCreated.mouse = false"
                @click="info.requestsCanBeCreated.click = !info.requestsCanBeCreated.click"
              />
              <div class="my-tooltip" v-if="info.requestsCanBeCreated.mouse || info.requestsCanBeCreated.click">
                isdjksdsdkssdkdskds koas dko sadkosd
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
                @mouseover="info.onlyManagersCanCreateARequest.mouse = true"
                @mouseleave="info.onlyManagersCanCreateARequest.mouse = false"
                @click="info.onlyManagersCanCreateARequest.click = !info.onlyManagersCanCreateARequest.click"
              />
              <div class="my-tooltip" v-if="info.onlyManagersCanCreateARequest.mouse || info.onlyManagersCanCreateARequest.click">
                isdjksdsdkssdkdskds koas dko sadkosd
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
                @mouseover="info.onlyContributorsCanApproveARequest.mouse = true"
                @mouseleave="info.onlyContributorsCanApproveARequest.mouse = false"
                @click="info.onlyContributorsCanApproveARequest.click = !info.onlyContributorsCanApproveARequest.click"
              />
              <div
                class="my-tooltip"
                v-if="info.onlyContributorsCanApproveARequest.mouse || info.onlyContributorsCanApproveARequest.click"
              >
                isdjksdsdkssdkdskds koas dko sadkosd
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
              type="number"
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
                @mouseover="info.minimumContributionPercentageRequired.mouse = true"
                @mouseleave="info.minimumContributionPercentageRequired.mouse = false"
                @click="info.minimumContributionPercentageRequired.click = !info.minimumContributionPercentageRequired.click"
              />
              <div
                class="my-tooltip"
                v-if="info.minimumContributionPercentageRequired.mouse || info.minimumContributionPercentageRequired.click"
              >
                isdjksdsdkssdkdskds koas dko sadkosd
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
              type="number"
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
                @mouseover="info.minimumApprovalsPercentageRequired.mouse = true"
                @mouseleave="info.minimumApprovalsPercentageRequired.mouse = false"
                @click="info.minimumApprovalsPercentageRequired.click = !info.minimumApprovalsPercentageRequired.click"
              />
              <div
                class="my-tooltip"
                v-if="info.minimumApprovalsPercentageRequired.mouse || info.minimumApprovalsPercentageRequired.click"
              >
                isdjksdsdkssdkdskds koas dko sadkosd
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
  </div>
</template>

<script>
import Web3 from 'web3';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, minLength, integer, minValue, maxValue } from '@vuelidate/validators';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { transaction, validateForm } from '@/helpers/helpers';

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
        type: {
          mouse: false,
          click: false,
        },
        name: {
          mouse: false,
          click: false,
        },
        addMeAsAManager: {
          mouse: false,
          click: false,
        },
        managers: {
          mouse: false,
          click: false,
        },
        managersCanBeAddedOrRemoved: {
          mouse: false,
          click: false,
        },
        managersCanTransferMoneyWithoutARequest: {
          mouse: false,
          click: false,
        },
        requestsCanBeCreated: {
          mouse: false,
          click: false,
        },
        onlyManagersCanCreateARequest: {
          mouse: false,
          click: false,
        },
        onlyContributorsCanApproveARequest: {
          mouse: false,
          click: false,
        },
        minimumContributionPercentageRequired: {
          mouse: false,
          click: false,
        },
        minimumApprovalsPercentageRequired: {
          mouse: false,
          click: false,
        },
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
            'Create new fund: ' + this.data.name,
          );
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
.container {
  padding: 0;
}

@media (min-width: 500px) {
  .container {
    padding: 0 15px;
  }
}

@media (min-width: 700px) {
  .container {
    padding: 0 50px;
  }
}

@media (min-width: 900px) {
  .container {
    padding: 0 100px;
  }
}

.form {
  background-color: rgb(252, 252, 252);
  padding: 18px 18px;
  border: 0.05px solid rgba(167, 167, 167, 0.296);
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 4px, rgba(0, 0, 0, 0.24) 0px 0px 2px;
}

@media (max-width: 400px) {
  .form {
    padding: 16px 12px;
  }
}

.fund-token-info {
  font-size: 1rem;
  color: #1d6aa8;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;

  .icon {
    font-size: 1.68em;
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
      background-color: rgb(225, 225, 225);
    }

    .my-tooltip {
      position: absolute;
      top: 50%;
      right: 120%;
      transform: translateY(-50%);
      color: rgb(255, 255, 255);
      background-color: rgb(50, 50, 50);
      padding: 1rem;
      border: 0.1px solid rgb(233, 233, 233);
      border-radius: 0.4rem;
    }
  }
}
</style>
