import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import revealPlugin from './animations.js'

createApp(App).use(revealPlugin).mount('#app')
