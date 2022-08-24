<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

export default {
  props: {
    date: {
      type: Date,
      required: true,
    },
  },
  computed: {
    dayjs() {
      return dayjs(this.date);
    },

    humanFriendlyDate() {
      return this.dayjs.format("llll");
    },
    
    diffForHumans() {
      return this.dayjs.fromNow();
    },
  },
};
</script>

<style scoped>

</style>
