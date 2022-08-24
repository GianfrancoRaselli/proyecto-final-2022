export default {
  state () {
    return {
      selectedLanguage: "English"
    }
  },

  getters: {

  },

  mutations: {
    setSelectedLanguage(state, selectedLanguage) {
      state.selectedLanguage = selectedLanguage;
    },
  },

  actions: {

  },
};
