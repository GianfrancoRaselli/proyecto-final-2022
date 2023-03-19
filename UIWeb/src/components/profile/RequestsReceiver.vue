<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="requestsToShow && requestsToShow.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span>La entidad no ha sido receptora de ninguna solicitud aún.</span>
      </div>
      <div v-else>
        <div class="item" :class="getRequestClass(request)" v-for="(request, index) in requestsToShow" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(request.timestamp)" />
          </div>
          <div class="content">
            <div class="info">
              <span class="info__label"><span class="text-bold">Fondo</span>:&nbsp;</span>
              <span
                class="hover"
                v-text="funds[request.fundIndex].name"
                @click="goToFund(funds[request.fundIndex].address)"
              ></span>
            </div>
            <div class="info" v-text="request.description" v-if="request.description" />
            <div class="info" v-if="request.petitioner">
              <span class="info__label"><span class="text-bold">Solicitante</span>:&nbsp;</span>
              <AppShowAddress class="hover" :address="request.petitioner" @click="goToProfile(request.petitioner)" />
            </div>
            <div class="info" v-if="request.recipient">
              <span class="info__label"><span class="text-bold">Destinatario</span>:&nbsp;</span>
              <AppShowAddress class="hover" :address="request.recipient" @click="goToProfile(request.recipient)" />
            </div>
            <div class="info">
              <span class="info__label"><span class="text-bold">Valor a transferir</span>:&nbsp;</span>
              <AppShowEth :weis="request.valueToTransfer" />
            </div>
            <div class="info" v-if="request.complete">
              <span class="info__label"><span class="text-bold">Valor transferido</span>:&nbsp;</span>
              <AppShowEth :weis="request.transferredValue" />
            </div>
            <div class="info" v-if="!request.complete">
              <span class="info__label"><span class="text-bold">Aprobaciones</span>:&nbsp;</span>
              <span
                v-text="
                  (request.approvalsCount | '0') +
                  ' de ' +
                  Math.ceil(maxNumOfApprovers(request) * (fund.minimumApprovalsPercentageRequired / 100)) +
                  ' necesarias'
                "
              >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { call, event, goToProfile, goToFund } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'RequestsCreatedProfileComponent',
  components: {},
  props: {
    funds: { type: Array, required: true },
  },
  data() {
    return {
      loading: true,
      request: [],
    };
  },
  computed: {
    requestsToShow() {
      let requestsToShow = this.requests.slice();

      // filter
      requestsToShow = requestsToShow.filter((request) => {
        return compareAddresses(request.recipient, this.$route.params.address);
      });

      // order
      requestsToShow = requestsToShow.sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });

      return requestsToShow;
    },
  },
  watch: {
    funds() {
      this.getRequests();
    },
  },
  methods: {
    goToProfile,
    goToFund,
    fromUnixTimestampToDate,

    getRequestClass(request) {
      if (request.complete) return 'request-completed';
      if (
        request.approvalsCount >=
        Math.ceil(this.maxNumOfApproversrequest * (this.funds[request.fundIndex].minimumApprovalsPercentageRequired / 100))
      )
        return 'request-approved';
      return 'request-created';
    },

    maxNumOfApprovers(request) {
      const fund = this.funds[request.fundIndex];
      if (fund.onlyContributorsCanApproveARequest) {
        if (fund.contributors) return fund.contributors.length;
        else return 0;
      } else {
        let num = 0;
        if (fund.contributors) {
          num = fund.contributors.length;
          if (fund.managers) {
            fund.managers.forEach((manager) => {
              let isAContributor = false;
              for (let i = 0; i < fund.contributors.length; i++) {
                if (fund.contributors[i].contributor === manager) {
                  isAContributor = true;
                  break;
                }
              }
              if (!isAContributor) num++;
            });
          }
        } else {
          if (fund.managers) num = fund.managers.length;
        }
        return num;
      }
    },

    async getRequests() {
      try {
        if (this.funds.length > 0) {
          await Promise.all(
            Array(this.funds.length)
              .fill()
              .map((element, index) => {
                return new Promise((resolve) => {
                  const searchRequests = async () => {
                    const totalRequests = parseInt(
                      await call({ name: 'Fund', address: this.funds[index].address }, 'requestsCount'),
                    );
                    let requests = [];

                    if (totalRequests > 0) {
                      requests = Array(totalRequests);

                      await Promise.all(
                        Array(totalRequests)
                          .fill()
                          .map((element, index) => {
                            return call(
                              { name: 'Fund', address: this.funds[index].address },
                              'requests',
                              [index],
                              {},
                              async (request) => {
                                request.fundIndex = index;
                                await event(
                                  { name: 'Fund', address: this.funds[index].address },
                                  'NewRequest',
                                  { filter: { requestIndex: index } },
                                  async (err, events) => {
                                    const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(
                                      events[0].blockNumber,
                                    );
                                    request.timestamp = block.timestamp;
                                  },
                                  true,
                                );
                                requests[index] = request;
                              },
                            );
                          }),
                      );
                    }

                    this.requests = requests;
                    resolve();
                  };
                  searchRequests();
                });
              }),
          );
        }
      } finally {
        this.loading = false;
      }
    },
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .spinner {
    margin-top: 2rem;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .no-items {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;
    }

    .item {
      padding: 0.65rem 0.55rem;
      border: 1px solid rgb(238, 238, 238);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      gap: 0.3rem;

      .header {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.4rem;

        .date {
          font-size: 0.8rem;
        }

        .badge {
          font-size: 0.75rem;
          margin-left: auto;
        }
      }

      .content {
        width: 100%;
        padding-left: 0.6rem;
        border-left: 1px solid rgb(163, 163, 163);
        display: flex;
        flex-direction: column;

        .info {
          display: flex;
          flex-direction: row;
          align-items: center;

          @media (max-width: 430px) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .address {
          font-weight: bold;
        }
      }
    }

    .request-completed {
      background-color: rgba(0, 0, 255, 0.19);
    }

    .request-approved {
      background-color: rgba(0, 128, 0, 0.262);
    }

    .request-created {
      background-color: rgba(255, 0, 0, 0.15);
    }
  }
}
</style>
