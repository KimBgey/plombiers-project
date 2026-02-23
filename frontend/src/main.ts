import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'

// Initialiser le thème AVANT le montage pour éviter le flash
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  // Thème clair par défaut
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')