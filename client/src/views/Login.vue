<template>
  <div class="login-container">
    <!-- Banner to indicate system type -->
    <div class="banner">Complaint Handling System for Agents</div>

    <el-form :model="form" label-width="80px">
      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async login() {
      const { username, password } = this.form

      // Encrypt password using MD5
      const encryptedPassword = md5(password)

      const loginUrl = 'http://localhost:8080/api/agent/login'

      try {
        // Call login API
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password: encryptedPassword,
          }),
        })

        if (!response.ok) {
          throw new Error('Login failed')
        }

        const user = await response.json()
        console.log('Login successful:', user)

        this.$router.push({ path: '/chat', query: { agentId: user.id } })
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed. Please check your username and password.')
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.banner {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #409eff;
}

.el-form {
  width: 300px;
}
</style>
