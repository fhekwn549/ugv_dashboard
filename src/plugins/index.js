import vuetify from './vuetify'
import store from './stores'
import router from '@/router'

export function registerPlugins(app) {
  app.use(vuetify)
  app.use(store)
  app.use(router)
}
