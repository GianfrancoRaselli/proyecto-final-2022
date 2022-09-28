<template>
  <div class="fund-container">
    <div class="col-sm-12 col-md-10 col-lg-10 col-xl-8 m-4 py-4 px-2 data-box">
      <div class="img-container mr-3">
        <img class="img" src="../assets/imgs/fund.jpg" />
      </div>

      <div class="fund-info mt-3">
        <h2 class="mb-3" v-text="fund._name" />
        <p v-if="fund._description"><strong>Description:</strong>&nbsp;<span v-text="fund._description" /></p>
      </div>

      <div class="w-100 m-3 mt-4 px-3">
        <div class="row">
          <div class="col-md-6 my-1">
            <button class="btn btn-light btn-block">Editar</button>
          </div>
          <div class="col-md-6 my-1">
            <button class="btn btn-light btn-block">Cambiar Clave</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { call } from '@/helpers/helpers';

export default {
  name: 'FundView',
  data() {
    return {
      fund: {
        _address: '',
        _balance: 0,
        _name: '',
        _description: '',
        _creator: '',
        _createdAt: 0,
        _managersCanBeAddedOrRemoved: false,
        _totalContributions: 0,
        _managersCanTransferMoneyWithoutARequest: false,
        _requestsCanBeCreated: false,
        _onlyManagersCanCreateARequest: false,
        _onlyContributorsCanApproveARequest: false,
        _minimumContributionPercentageRequired: 0,
        _minimumApprovalsPercentageRequired: 0,
      },
    };
  },
  methods: {},
  async created() {
    this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
  },
};
</script>

<style scoped>
.fund-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
}

.data-box {
  background-color: rgb(144, 149, 154);
  border: 1px rgb(48, 47, 47) solid;
  border-radius: 5px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.img-container {
  padding: 2%;
  border-radius: 10px;
  box-shadow: 0.2px 0.2px 5px rgba(0, 0, 0, 0.4);
}

.img {
  width: 200px;
  height: 200px;
  border-radius: 100%;
}
</style>
