import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; 
import './index.css'

import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { FcGoogle, ViFileTypeApplescript } from 'oh-vue-icons/icons';

addIcons(FcGoogle, ViFileTypeApplescript);

const app = createApp(App);

app.component('v-icon', OhVueIcon);

app.use(router);
app.mount('#app')
