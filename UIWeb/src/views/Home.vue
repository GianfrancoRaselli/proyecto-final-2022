<template>
  <div class="content">
    <div class="header">
      <span class="title">jdjfdk iek okpkld lkikdfik okodfle</span>
      <span class="description">
        jddfjsfkd dsk kopdkopk fdi keojiosr dfr opkfld kopdskop dfopko dsk dskopñop kop kok oikjijiijgh ujio kkk
      </span>
    </div>
    <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
      <button class="btn btn-primary btn-discover">
        <span>Discover funds</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
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
  padding: 0 370px 0 50px;
  z-index: 0;
  background-image: url('@/assets/imgs/background-sm.jpg');
  background-repeat: no-repeat;
  background-size: 310px 100%;
  background-position: bottom right;
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
}

.description {
  font-size: 0.8rem;
  color: rgba(72, 72, 72, 0.748);
}

@media (max-width: 720px) {
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
}
</style>
