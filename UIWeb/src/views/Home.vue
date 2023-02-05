<template>
  <div class="content">
    <div class="header">
      <span class="title">Transformando la forma de financiación</span>
      <span class="description"
        >Brindamos seguridad y autocontrol a todos los que buscan una forma totalmente descentralizada de administrar fondos de
        dinero compartidos utilizando los contratos inteligentes de la cadena de bloques de Ethereum.</span
      >
    </div>
    <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
      <button class="btn btn-primary btn-discover">
        <span>Descubrir fondos</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.content {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  height: calc(100vh - var(--navbar-height) - var(--mobile-navbar-height) - var(--footer-height));
  min-width: 100vw;
  width: 100vw;
  margin: 0;
  padding: 0 500px 0 100px;
  z-index: 0;
  background-image: url('@/assets/imgs/background-sm.jpg');
  background-repeat: no-repeat;
  background-size: 310px 100%;
  background-position: bottom right;
  animation: fadeInUpBig 1s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

@media (min-width: 768px) {
  .content {
    height: calc(100vh - var(--navbar-height) - var(--footer-height));
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.748);

  animation: fadeInUpBig 1.8s;
}

.description {
  font-size: 0.8rem;
  color: rgba(72, 72, 72, 0.748);

  animation: fadeInUpBig 2s;
}

.btn-discover {
  animation: fadeInUpBig 2.5s;
}

@media (max-width: 1150px) {
  .content {
    padding-left: 20px;
    padding-right: 330px;
  }
}

@media (max-width: 520px) {
  .content {
    background: none;
    padding: 0 30px;
    text-align: center;
    align-items: center;
  }

  .title {
    animation-duration: 1.2s;
  }

  .description {
    animation-duration: 1.4s;
  }

  .btn-discover {
    animation-duration: 1.8s;
  }
}
</style>
