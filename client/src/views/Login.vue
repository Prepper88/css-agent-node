
<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-left">
        <img src="/css-logo.png" alt="logo" class="logo" />
        <h1 class="title">Agent Sign In</h1>
        <p class="subtitle">Use your Agent account</p>
      </div>
      <div class="login-right">
        <input v-model="form.username" type="text" placeholder="Agent username" class="input-field" />
        <input v-model="form.password" type="password" placeholder="Password" class="input-field" />

        <div class="actions">
          <button class="primary-button" @click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5"

export default {
  name: "AgentLogin",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    }
  },
  methods: {
    async login() {
      const { username, password } = this.form
      if (!username || !password) return alert("Please enter both username and password.")
      const encryptedPassword = md5(password)

      try {
        const res = await fetch("http://localhost:8080/api/agent/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password: encryptedPassword,
          }),
        })

        if (!res.ok) throw new Error("Login failed")
        const data = await res.json()
        localStorage.setItem("agent", JSON.stringify(data))
        localStorage.setItem("isLoggedIn", true)
        this.$router.push("/chat")
      } catch (err) {
        alert("Login failed. Please try again. err: ", err)
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  background-color: #f2f3f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto, Arial, sans-serif;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  padding: 48px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
}

.login-left {
  flex: 1;
  padding-right: 48px;
  border-right: 1px solid #eee;
}

.logo {
  height: 80px;
}

.title {
  font-size: 28px;
  margin: 0 0 8px;
  color: #202124;
}

.subtitle {
  font-size: 16px;
  color: #5f6368;
}

.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 48px;
}

.input-field {
  font-size: 16px;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  margin-bottom: 18px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.primary-button {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.primary-button:hover {
  background-color: #1967d2;
}
</style>
