<template>
  <span class="date" data-toggle="tooltip" data-placement="top" title="" :data-original-title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script>
import $ from 'jquery';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
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
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
};
</script>

<style scoped>
.date {
  max-width: fit-content;
  min-width: fit-content;
}
</style>
