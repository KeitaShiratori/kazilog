import Vue from 'vue'
import { Datetime, DatetimePopup } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import { Settings } from 'luxon'
 
Settings.defaultLocale = 'ja'
Vue.component('datetime', Datetime);
Vue.component('datetime-popup', DatetimePopup);