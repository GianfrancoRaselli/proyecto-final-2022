<template>
  <div class="fund-extra-information-content">
    <div class="header">
      <span class="title">Actualizaciones</span>
      <button class="btn btn-primary" @click="addUpdate = true" v-if="isAManager && !addUpdate">Agregar actualización</button>
    </div>
    <hr />
    <div class="mb-5" v-show="addUpdate">
      <MyEditor
        :loading="loading"
        :toEdit="newUpdate"
        :maxLength="25000"
        :allowSubmit="newUpdate.length > 0"
        @close="addUpdate = false"
        @change="(newValue) => (newUpdate = newValue)"
        @submit="handleSubmit"
      />
    </div>
    <div class="updates" v-if="fund.updates && fund.updates.length > 0">
      <div class="update" v-for="(update, i) in updatesOrdered" :key="i">
        <UpdateHeader :entityAddress="update.updater" :date="update.updatedAt" />
        <hr />
        <div class="mt-3" v-html="update.description"></div>
      </div>
    </div>
    <div class="not-information" v-else>
      <fa-icon icon="xmark" class="icon" size="5x" />
      <span>No hay actualización por el momento.</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex';
import { signMessage } from '@/helpers/connection';
import { addNotification } from '@/composables/useNotifications';

import UpdateHeader from '@/components/fund/fundExtraInformation/contents/UpdateHeader.vue';
import MyEditor from '@/components/MyEditor';

export default {
  name: 'FundExtraInformationUpdatesComponent',
  components: {
    UpdateHeader,
    MyEditor,
  },
  props: {
    isAManager: { type: Boolean, required: true },
    fund: { type: Object, required: true },
  },
  data() {
    return {
      addUpdate: false,
      loading: false,
      newUpdate: '',
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),

    updatesOrdered() {
      return this.fund.updates.slice().sort((a, b) => {
        if (new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime()) return 1;
        if (new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()) return -1;
        return -1;
      });
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        if (!this.signature) await signMessage();
        await axios.put('fund/' + this.fund.address, { update: this.newUpdate });
        // eslint-disable-next-line vue/no-mutating-props
        this.fund.updates.push({
          updater: this.address,
          description: this.newUpdate,
          updatedAt: new Date(),
        });
        addNotification({
          message: 'Actualización guardada',
          type: 'success',
        });
        this.newUpdate = '';
        this.addUpdate = false;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.updates {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 1.5rem;

  .update {
    width: 100%;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
