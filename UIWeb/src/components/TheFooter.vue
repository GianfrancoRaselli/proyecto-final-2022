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
  background-color: rgb(121, 122, 122);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.designed-by {
  font-size: 18px;
}

a,
a:hover {
  color: black;
}
</style>
