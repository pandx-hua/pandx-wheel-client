<script setup>

import LoginForm from '@/views/Login/components/LoginForm.vue';
import loginLeft1 from '@/assets/images/login_left1.png';
import loginLeft2 from '@/assets/images/login_left2.png';
import loginLeft3 from '@/assets/images/login_left3.png';
import loginLeft4 from '@/assets/images/login_left4.png';
import loginLeft5 from '@/assets/images/login_left5.png';
import loginLeft6 from '@/assets/images/login_left6.png';
import loginLeft7 from '@/assets/images/login_left7.png';
import {ref} from 'vue';

const index=ref(0);
const choice = () => {
  //const index = Math.floor(Math.random() * 7) + 1;
  // return eval(`left${index}`).value;
  return Math.floor(Math.random() * 7) + 1;
};
</script>

<template>
  <div class="login-container flex-center">
    <div class="login-box">
      <div class="login-left" :key="index=choice()">
        <img :src="loginLeft1" alt="login" class="login-left-img" v-if="index===1">
        <img :src="loginLeft2" alt="login" class="login-left-img" v-if="index===2">
        <img :src="loginLeft3" alt="login" class="login-left-img" v-if="index===3">
        <img :src="loginLeft4" alt="login" class="login-left-img" v-if="index===4">
        <img :src="loginLeft5" alt="login" class="login-left-img" v-if="index===5">
        <img :src="loginLeft6" alt="login" class="login-left-img" v-if="index===6">
        <img :src="loginLeft7" alt="login" class="login-left-img" v-if="index===7">
      </div>
      <div class="login-right">
        <div class="login-logo">
          <img alt="pandx.Wheel" class="login-icon" src="@/assets/images/logo.png"/>
          <h2 class="login-txt">pandx.Wheel</h2>
        </div>
        <LoginForm></LoginForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>