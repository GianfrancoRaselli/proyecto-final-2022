<template>
  <div class="content">
    <nav class="navbar navbar-dark bg-dark">
      <div class="navbar" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'Funds' }" exact>
              <FaIcon icon="list" class="link-icon" size="2x"></FaIcon>
              <span class="link-text">Fondos</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'CreateFund' }" exact>
              <FaIcon icon="plus" class="link-icon" size="2x"></FaIcon>
              <span class="link-text">Crear</span>
            </router-link>
          </li>
          <li class="nav-item">
            <a class="item-link" data-toggle="modal" data-target="#buyFundTokensModal">
              <FaIcon icon="money-bill" class="link-icon" size="2x"></FaIcon>
              <span class="link-text">FundToken</span>
            </a>
          </li>
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'AboutUs' }" exact>
              <FaIcon icon="building" class="link-icon" size="2x"></FaIcon>
              <span class="link-text">Nosotros</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="item-link" :to="{ name: 'FrequentQuestions' }" exact>
              <FaIcon icon="question" class="link-icon" size="2x"></FaIcon>
              <span class="link-text">Preguntas</span>
            </router-link>
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

<style lang="scss" scoped>
nav {
  color: white;
  height: 100%;
  width: 100%;
}

.navbar {
  height: 100%;
  width: 100%;
  padding: 0;
}

.navbar-nav {
  height: 100%;
  width: 100%;
  padding: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .nav-item {
    width: 16%;
    padding: 0.3rem 0;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 8px, rgba(0, 0, 0, 0.24) 0px 0px 4px;

    .item-link {
      cursor: pointer;
      color: white;
      text-decoration: none;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      gap: 0.28rem;

      .link-text {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
