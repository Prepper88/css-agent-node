<template>
    <el-form :model="form" label-width="80px">
      <el-form-item label="Username">
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">Login</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
          username: '',
          password: ''
      };
    },
    methods: {
      login() {
        // login to java and get agent id
        let agentId = 222222
        // jump to chat
        this.$router.push({ path: '/chat', query: { agentId: this.agentId } })
      }
    }
  };
  </script>