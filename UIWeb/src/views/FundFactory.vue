<template>
  <div>
    <p class="page-title">FundFactory</p>
    <div class="fund-factory-container">
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount">Gianfranco Raselli</span>
            <span class="unit">Dueño del FundFactory</span>
          </span>
          <span class="description"
            >La entidad propietaria del FundFactory puede retirar el dinero ganado y cambiar el precio de venta del
            FundToken.</span
          >
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount">5</span>
            <span class="unit">Fondos desplegados</span>
          </span>
          <span class="description">Cantidad de fondos desplegados y almacenados en el FundFactory.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount">5</span>
            <span class="unit">Precio del FundToken</span>
          </span>
          <span class="description">Precio de venta de un FundToken.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount">5</span>
            <span class="unit">Dinero recaudado</span>
          </span>
          <span class="description">Total del dinero recaudado con la venta de FundTokens.</span>
        </div>
      </div>
      <div class="item-container">
        <div class="item">
          <span class="value">
            <span class="amount">5</span>
            <span class="unit">Dinero disponible</span>
          </span>
          <span class="description">Dinero actual disponible en el FundFactory aún sin retirar.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FundFactoryView',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  async created() {},
};
</script>

<style lang="scss" scoped>
.fund-factory-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;

  .item-container {
    min-height: 100%;
    width: 33%;
    padding: 0.5rem;

    .item {
      height: 100%;
      width: 100%;
      padding: 1rem;
      border: 1px solid rgb(145, 145, 145);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 0.8rem;

      .value {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;

        .amount {
          font-size: 1.6rem;
          font-weight: bold;
        }

        .unit {
          font-size: 0.95rem;
          color: grey;
        }
      }
    }
  }
}
</style>
