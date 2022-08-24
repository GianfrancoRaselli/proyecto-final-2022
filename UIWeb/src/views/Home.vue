<template>
  <div class="welcome">
    <span class="welcome-text">¡Welcome!</span>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      
    };
  },
  methods: {
    
  },
};
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 50%;
}

.welcome-text {
  font-size: 52px;
  font-weight: bold;
}

@media (max-width: 450px) {
  .welcome-text {
    font-size: 30px;
  }
}
</style>
