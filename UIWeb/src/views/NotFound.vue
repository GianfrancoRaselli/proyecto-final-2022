<template>
  <div class="error-alert-container">
    <div class="alert alert-danger error-alert" role="alert">
      <FaIcon icon="circle-exclamation" class="icon" size="5x" />
      <div class="error-msg large-screen">
        <p>¡Error&nbsp;<strong>404</strong>&nbsp;-&nbsp;Página no encontrada!</p>
      </div>
      <div class="error-msg small-screen">
        <p>Error&nbsp;<strong>404</strong></p>
        <p>Página no encontrada</p>
      </div>
      <router-link class="redirect" :to="{ name: 'Home' }">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>

<style lang="scss" scoped>
.small-screen {
  display: none;
}

@media screen and (max-width: 768px) {
  .large-screen {
    display: none;
  }

  .small-screen {
    display: block;
    font-size: 1.8rem;
  }
}
</style>
