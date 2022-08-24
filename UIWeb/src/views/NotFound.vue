<template>
  <div class="alert alert-danger error-alert" role="alert">
    <fa-icon icon="circle-exclamation" class="icon" size="5x"></fa-icon>
    <div class="error-msg large-screen">
      <p>¡Error <strong>404</strong> - Page Not Found!</p>
    </div>
    <div class="error-msg small-screen">
      <p>Error <strong>404</strong></p>
      <p>Page Not Found</p>
    </div>
    <router-link :to="{ name: 'Home' }" class="redirect">Go Home</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
.error-alert {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2.5rem;
  border-radius: 15px;
  padding-bottom: 3rem;
}

.icon {
  margin-top: 2rem;
}

.error-msg {
  margin: 1.5rem;
  font-size: 2rem;
  text-align: center;
}

.small-screen {
  display: none;
}

.redirect {
font-size: 1.2rem;
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
