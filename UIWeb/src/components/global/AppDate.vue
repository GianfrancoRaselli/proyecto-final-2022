<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedDate from 'dayjs/plugin/localizedFormat';
dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

export default {
  name: 'AppDateComponent',
  props: {
    date: { type: Date, required: true },
  },
  computed: {
    dayjs() {
      return dayjs(this.date);
    },

    humanFriendlyDate() {
      return this.dayjs.format('llll');
    },

    diffForHumans() {
      const fromNow = this.dayjs.fromNow().toString();
      return fromNow.charAt(0).toUpperCase() + fromNow.slice(1);
    },
  },
};
</script>

<style scoped></style>
