<template>
  <div class="question">
    <div class="ask" :class="[{ 'ask-open': show }, color]" v-text="ask" @click="show = !show" />
    <div class="bar" v-if="show"></div>
    <div class="answer" v-if="show">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionComponent',
  props: {
    ask: { type: String, required: true },
    color: { type: String, required: true },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.question {
  width: 100%;
  border: 0.4px solid rgba(109, 109, 109, 0.737);
  border-radius: 0.4rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

  .ask {
    cursor: pointer;
    user-select: none;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 1.2rem;
    border-radius: 0.4rem;
    background-color: rgb(242, 242, 242);
  }

  .ask-open {
    border-radius: 0.4rem 0.4rem 0 0;
  }

  .ask:hover {
    text-decoration: underline;
  }

  .bar {
    height: 0.7px;
    background-color: rgba(109, 109, 109, 0.363);
  }

  .answer {
    padding: 1.2rem;
    border-radius: 0 0 0.4rem 0.4rem;
    background-color: rgb(251, 251, 251);
  }
}
</style>
