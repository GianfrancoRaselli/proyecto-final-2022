import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

import config from './modules/config'
import connection from './modules/connection'


export default createStore({
  state () {
    return {

    }
  },

  getters: {

  },

  mutations: {

  },

  actions: {
    
  },

  modules: {
    config,
    connection,
  },

  plugins: [
    createPersistedState({
      paths: [
        'config.selectedLanguage',
        'connection.address',
        'connection.chainId',
        'connection.disconnected',
      ],
      storage: localStorage
    })
  ],
});
