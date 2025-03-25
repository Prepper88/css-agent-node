
<template>
  <div class="agent-chat-wrapper">
    <!-- Left Sidebar: Conversations -->
    <div class="sidebar">
      <ul class="conversation-list">
        <li v-for="(item, index) in conversations" :key="index" @click="selectConversation(item)" :class="['conversation-item', selectedConversation && selectedConversation.sessionId === item.sessionId ? 'selected' : '', item.isNew ? 'new-session' : '']">
          <!-- <div>{{ item.summary }}</div> -->
          <div class="conversation-avatar">
            <img :src="item.avatar" alt="avatar" />
          </div>
          <div class="conversation-text">
            <div class="conversation-header">
              <span class="conversation-name">{{ item.customerName }}</span>
              <span v-if="item.isNew" class="badge-new">NEW</span>
            </div>
            <div class="conversation-preview">abc</div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Middle Panel: Chat -->
    <div class="chat-main">

      <div class="chat-messages">
        <div
          v-for="(msg, index) in selectedConversation ? selectedConversation.messages : []"
          :key="index"
          :class="['message', msg.senderType === 'agent' ? 'agent' : msg.senderType === 'customer' ? 'customer':msg.senderType === 'robot' ? 'robot' : 'system']"
        >
          <span>{{ msg.message }}</span>
        </div>
      </div>

      <div class="chat-input">
        <input v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>

    <!-- Right Panel: Ticket & Order -->
    <div class="ticket-panel">
      <div class="ticket-header">
        <span>{{ agent.username }}</span>
        <select v-model="agent.status" @change="updateStatus" class="status-dropdown">
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div class="ticket-body">
        <!-- Reserved for ticket editing & order details -->
        <p style="color:#888; text-align:center; margin-top: 32px;">Ticket panel under construction</p>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { generateAvatar } from "@/utils/avatar"
import axios from 'axios'

export default {
  name: "AgentChat",
  data() {
    return {
      agent: {},
      newMessage: "",
      selectedConversation: null,
      conversations: [],
    };
  },
  mounted() {
    this.initializeAgent()
    this.initializeSocket()
  },
  /*
  created() {
    if (this.conversations.length > 0) {
      this.selectedConversation = this.conversations[0];
    }
  },*/
  methods: {
    initializeAgent() {
      const currentAgent = JSON.parse(localStorage.getItem('agent'))
      console.log('load agent: ', currentAgent)
      this.agent = currentAgent
    },
    initializeSocket() {
      // Connect to the Socket.IO server
      this.socket = io('http://localhost:3001'); // Replace with your server URL

      // Send agent-inbound event with agentId
      this.socket.emit('agent-inbound', this.agent.id );

      // Listen for new sessions assigned to the agent
      this.socket.on('session-loaded', (sessions) => {
        console.log('session loaded, session: ', sessions);
        
        for (let session of sessions) {
          const { sessionId, customerId, customerName, status, messages } = session;

          // Add a new tab for the session
          this.conversations.push({
            sessionId,
            customerId,
            avatar: generateAvatar(customerName),
            customerName,
            summary: customerName,
            messages: messages,
            status: status
          });
        }
        // Set the new tab as active
        if (!this.selectedConversation && this.conversations.length != 0) {
          this.selectedConversation = this.conversations[0]
        }
      });

      // Listen for new sessions assigned to the agent
      this.socket.on('new-session', (session) => {
        console.log('new session: ', session);
        
        const { sessionId, customerId, customerName, status, messages } = session;
        // Add a new tab for the session
        this.conversations.push({
          sessionId,
          customerId,
          avatar: generateAvatar(customerName),
          summary: customerName,
          messages: messages,
          status: status,
          isNew: true
        });
        // Set the new tab as active
        if (!this.selectedConversation) {
          this.selectedConversation = this.conversations[0]
        }
      });

      //agent status updated
      this.socket.on('agent-status-updated', (agentStatus)=>{
        this.agent.status = agentStatus
      })

      // Listen for incoming messages
      this.socket.on('message', (data) => {
        const { sessionId, message, senderType } = data;
        console.log('receive message: ' + message + ' sessionId: ' + sessionId + ' senderType:' + senderType)

        const conversation = this.conversations.find((conversation) => conversation.sessionId === sessionId);
        if (conversation) {
          // Add the message to the tab's chat
          conversation.messages.push({
            sessionId,
            senderType,
            message,
            time: new Date().toLocaleTimeString(),
          });
          // Scroll to the bottom
          this.$nextTick(() => {
            const chatWindow = this.$el.querySelector('.chat-window');
            if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
          });
        }
      });

      // Listen for incoming complaints
      this.socket.on('complaint', (data) => {
        this.complaints.push({
          content: data.content,
          time: new Date().toLocaleTimeString(),
        });
      });
    },
    selectConversation(item) {
      this.selectedConversation = item;
      this.selectedConversation.isNew = false;
    },
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedConversation) return;

      const msg = {
        sessionId: this.selectedConversation.sessionId,
        senderId: this.agent.id,
        senderType: "agent",
        message: this.newMessage,
      }
      this.selectedConversation.messages.push(msg);

      this.socket.emit('send-message', msg)
      this.newMessage = "";
    },
    
    async updateStatus() {
      try {
        const response = await fetch("http://localhost:8080/api/agent/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: this.agent.id,
            status: this.agent.status,
          }),
        });
        if (!response.ok) throw new Error("Failed to update status");
        console.log("Status updated to", this.agent.status);
      } catch (err) {
        alert("Failed to update agent status:", err);
      }
    },
  },
};
</script>

<style scoped>
.agent-chat-wrapper {
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 10%;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
}

.conversation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.conversation-item {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.conversation-item:hover {
  background-color: #f1f1f1;
  border-radius: 0.5rem;
}

.conversation-item.selected {
  /* background-color: #e3e3e3;
  font-weight: bold;
  border-radius: 0.5rem; */

  background-color: #f3f4f6;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s ease;
}
/* 
.conversation-item.new-session {
  border-left: 4px solid #4f46e5;
  background-color: #f0f8ff;
} */

.conversation-item.new-session {
  position: relative;
}

.conversation-item.new-session::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #4f46e5;
  border-radius: 50%;
}


.conversation-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.conversation-text {
  flex: 1;
  overflow: hidden;
}
.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.conversation-name {
  font-weight: 600;
  font-size: 14px;
}
.conversation-preview {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.badge-new {
  background-color: #4f46e5;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}


/* Middle */
.chat-main {
  width: 40%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
}

.chat-header {
  padding: 16px 24px;
  font-weight: 500;
  background-color: #fafafa;
  border-bottom: 1px solid #ddd;
}

.chat-messages {
  padding: 24px;
  height: 95%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  white-space: pre-wrap;
}

.message.customer {
  background-color: #DCF8C6;
  align-self: flex-start;
}

.message.agent {
  background-color: #E8F0FE;
  align-self: flex-end;
}


.message.robot {
  background-color: #F3F3F3;
  align-self: flex-end;
}

.message.system {
  background-color: #FFF4E5;
  align-self: center;
  font-size: 13px;
}

.chat-input {
  display: flex;
  height: 5%;
  padding: 12px 16px;
  gap: 12px;
  background-color: #fafafa;
}

.chat-input input {
  width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.chat-input button {
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background-color: #1a73e8;
  color: white;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #1967d2;
}

/* Ticket Panel */
.ticket-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  background: #fcfcfc;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px;
  border-bottom: 1px solid #ddd;
  background: #fafafa;
}

.status-dropdown {
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.ticket-body {
  width: 40%;
  padding: 16px;
}
</style>