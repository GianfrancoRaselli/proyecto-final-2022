<template>
  <div class="background">
    <div class="bg-color">
      <div class="content">
        <router-link :to="{ name: 'Funds', params: { animation: 'slide' } }">
          <button class="btn btn-primary">
            <span>Discover funds</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
          </button>
        </router-link>
      </div>
    </div>
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
.background {
  position: fixed;
  top: 65px;
  left: 0;
  height: calc(100vh - 65px);
  width: 100%;
  background-image: url('../assets/imgs/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  background-attachment: fixed;
}

.bg-color {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
}

.content {
  height: 100%;
  padding-bottom: 35px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
}

.btn {
  font-size: 22px;
  padding: 12px 25px;
  border-radius: 100px;
  animation-duration: 1s;
  animation-name: bounce;
}

@keyframes bounce {
  0% {
    margin-top: 0;
  }

  50% {
    margin-top: -70px;
  }

  100% {
    margin-top: initial;
  }
}
</style>
