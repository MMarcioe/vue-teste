import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/pt-BR'
import router from './router'

// quasar css
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// App
import root from './App.vue'
const app = createApp(root)

app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
})

app.use(router)

// index.html
app.mount('#app')
