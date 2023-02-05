<template>
  <div class="content">
    <nav class="navbar navbar-dark bg-dark">
      <div class="navbar" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'CreateFund' }" exact>
              <fa-icon icon="plus" class="link-icon" size="2x"></fa-icon>
              <span class="link-text">Crear</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'Funds' }" exact>
              <fa-icon icon="list" class="link-icon" size="2x"></fa-icon>
              <span class="link-text">Fondos</span>
            </router-link>
          </li>
          <li class="nav-item">
            <a class="item-link" data-toggle="modal" data-target="#buyFundTokensModal">
              <fa-icon icon="money-bill" class="link-icon" size="2x"></fa-icon>
              <span class="link-text">FundToken</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'TheMobileNavbarComponent',
  data() {
    return {};
  },
  computed: {
    ...getMessages(['']),

    ...mapState({}),
    ...mapGetters(['']),
  },
  methods: {},
};
</script>

<style scoped>
nav {
  color: white;
  height: 100%;
  width: 100%;
}

.navbar {
  height: 100%;
  width: 100%;
  padding: 0;
  padding-top: 2px;
}

.navbar-nav {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.item-link {
  cursor: pointer;
  color: white;
  text-decoration: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.link-text {
  font-size: 0.8rem;
}
</style>
