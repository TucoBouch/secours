import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { initSettings } from './settings'
import './style.css'

initSettings()
createApp(App).use(router).mount('#app')
