import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#4fc3f7',
          secondary: '#80cbc4',
          accent: '#ff8a65',
          error: '#ef5350',
          warning: '#ffa726',
          info: '#42a5f5',
          success: '#66bb6a',
          surface: '#1e1e1e',
          background: '#121212',
        },
      },
    },
  },
  defaults: {
    VCard: { elevation: 2, rounded: 'lg' },
    VBtn: { variant: 'flat', rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'compact' },
    VSelect: { variant: 'outlined', density: 'compact' },
  },
})
