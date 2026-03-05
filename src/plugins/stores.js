import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  state() {
    return {
      connectedHost: null,
      robotId: 'ugv01',
    }
  },
  mutations: {
    setConnectedHost(state, host) {
      state.connectedHost = host
    },
    setRobotId(state, id) {
      state.robotId = id
    },
  },
  getters: {
    isConnected: (state) => !!state.connectedHost,
  },
  plugins: [
    createPersistedState({
      paths: ['robotId'],
    }),
  ],
})

export default store
