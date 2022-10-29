<template>
  <footer class="footer">
    <span class="designed-by">
      Designed by&nbsp;<a href="https://www.linkedin.com/in/gianfranco-raselli/" target="_blank">Raselli, Gianfranco</a>
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
  font-family: 'Segoe Print';
  background-color: rgb(121, 122, 122);
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.designed-by {
  font-size: 1.2rem;
}

a,
a:hover {
  color: black;
}
</style>
