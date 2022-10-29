<template>
  <div class="background">
    <div class="bg-color">
      <div class="content">
        <router-link class="btn-discover-link" :to="{ name: 'Funds', params: { animation: 'slide' } }">
          <button class="btn btn-primary btn-discover">
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
  max-width: none;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
  background-image: url('@/assets/imgs/background-lg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
}

@media (max-width: 720px) {
  .background {
    background-image: url('@/assets/imgs/background-sm.jpg');
    background-position: top;
  }
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

@media (max-width: 1200px) {
  .content {
    padding-bottom: 30px;
  }
}

@media (max-width: 992px) {
  .content {
    padding-top: 150px;
    padding-bottom: 0;
    justify-content: start;
  }
}

.btn-discover {
  font-family: 'Garamond', 'serif';
  font-size: 1.4rem;
  padding: 12px 25px;
  border-radius: 100px;
  animation-duration: 1s;
  animation-name: bounce;
}

@media (max-width: 720px) {
  .btn-discover-link {
    display: none;
  }
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
