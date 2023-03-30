<template>
  <footer class="footer">
    <span class="designed-by">
      Diseñado por&nbsp;<a href="https://www.linkedin.com/in/gianfranco-raselli/" target="_blank">Raselli, Gianfranco</a>
    </span>
  </footer>
</template>

<script>
export default {
  name: 'TheFooterComponent',
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style scoped>
.footer {
  font-family: 'Dancing Script', cursive;
  font-size: 1.42rem;
  background-color: rgb(234, 234, 234);
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.65);
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

a,
a:hover {
  color: black;
}
</style>
