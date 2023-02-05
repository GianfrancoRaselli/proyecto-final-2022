export default {
  state() {
    return {
      selectedLanguage: 'Español', // English
    };
  },

  getters: {},

  mutations: {
    setSelectedLanguage(state, selectedLanguage) {
      state.selectedLanguage = selectedLanguage;
    },
  },

  actions: {},
};
