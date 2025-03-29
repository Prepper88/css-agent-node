<template>
  <div class="chat-item" @mouseenter="hover = true" @mouseleave="hover = false">
    <!-- 头像：使用 UI Avatars -->
    <!-- <img :src="avatarUrl" class="avatar" /> -->
    <div v-html="avatarSvg" class="avatar"></div>

    <!-- 用户名 -->
    <div class="username">{{ username }}</div>

    <!-- 新标记 -->
    <div v-if="isNew" class="badge">new</div>

    <!-- 关闭按钮 -->
    <span class="close-btn" v-if="hover" @click.stop="closeSession">✖</span>
  </div>
</template>

<script>
import multiavatar from '@multiavatar/multiavatar'
import axios from '@/api/axiosInstance.js'

export default {
  name: 'ChatItem',
  props: {
    username: {
      type: String,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    conversation: Object,
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    avatarSvg() {
      return multiavatar(this.username)
    },
  },
  methods: {
    async closeSession() {
      axios.post('/api/session/end', null, {
        params: {
          sessionId: this.conversation.sessionId,
          endedBy: 'agent',
          endedById: this.$parent.agent.id,
        },
      })
      this.$parent.closeConversation(this.conversation.sessionId)
    },
  },
}
</script>

<style scoped>
.chat-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-item:hover {
  background-color: #f0f0f0;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}
.username {
  font-family: Roboto Medium;
  flex: 1;
  font-weight: 800;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge {
  background-color: #4caf50;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 6px;
}
.icon {
  margin-left: auto;
  padding-left: 10px;
}
.close-btn {
  font-size: 13px;
  color: #888;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  transition: background 0.2s;
}
.close-btn:hover {
  background-color: #ddd;
  color: #000;
}
</style>
