import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import './main.css'

import { FcUnderlineBtn,FcTypingInput,FcArrowBtn  } from "fancy-components";
/* eslint-disable no-new */
new FcUnderlineBtn()
new FcTypingInput()
new FcArrowBtn()

Object.defineProperty(globalThis, 'CESIUM_BASE_URL', {
  value: import.meta.env.VITE_CESIUM_BASE_URL
})

const app = createApp(App);
app.use(createPinia())
app.use(Antd)
app.mount('#app')
