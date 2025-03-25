<template>
    <div :class="['message', senderTypeClass]">
      <!-- Avatar（靠左或靠右） -->
      <div
        v-if="showAvatar"
        class="message-avatar"
        :class="{ right: isSelf }"
        v-html="avatarSvg">
      </div>
  
      <!-- 内容气泡 -->
      <span class="message-content">{{ message }}</span>
    </div>
  </template>
  
  <script>
  import multiavatar from '@multiavatar/multiavatar';
  import avatarRobot from '@/assets/robot.svg?raw'
  import avatarAgent  from '@/assets/agent.svg?raw'

  export default {
    name: "ChatMessage",
    compoments: [multiavatar],
    props: {
      senderType: String,
      message: String,
      senderName: String,
    },
    computed: {
      senderTypeClass() {
        return this.senderType || "system";
      },
      isSelf() {
        return this.senderType === "agent" || this.senderType === "robot" ;
      },
      showAvatar() {
        return this.senderType !== "system"; // 系统消息不显示头像
      },
      avatarSvg() {
        if (this.senderType === 'agent') {
            return avatarAgent
        } else if (this.senderType === 'robot') {
            return avatarRobot
        } else if (this.senderType === 'customer') {
            return multiavatar(this.username);
        }
        return ""
      },
    },
  };
  </script>
  
  <style scoped>
  .message {
    display: flex;
    align-items: flex-start;
    margin: 8px 0;
  }
  .message.robot,
  .message.agent {
    align-self: flex-end;
  }
  .message.customer {
    align-self: flex-start;
  }
  .message.system {
    align-self: center;
    font-size: 13px;
    color: #888;
  }
  
  /* 头像 */
  .message-avatar {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin: 0 8px;
    object-fit: cover;
  }
  .message-avatar.right {
    order: 2;
  }
  
  /* 气泡内容 */
  .message-content {
    /* max-width: 80%; */
    padding: 10px 14px;
    border-radius: 12px;
    background-color: #f1f1f1;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
  }
  .message.agent .message-content {
    background-color: #d2f1ff;
  }
  .message.robot .message-content {
    background-color: #ffe9a7;
  }
  </style>
  