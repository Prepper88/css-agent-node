<template>
  <div class="agent-chat-wrapper">
    <!-- Left Sidebar: Conversations -->
    <div class="sidebar">
      <ul class="conversation-list">
        <ChatItem v-for="(item, index) in conversations" :key="index" @click="selectConversation(item)" :username="item.customerName" :isNew="item.isNew"></ChatItem>
      </ul>
    </div>

    <!-- Middle Panel: Chat -->
    <div class="chat-main">
      <div class="chat-messages" ref="messageContainer">
        <ChatMessage
          v-for="(msg, index) in selectedConversation ? selectedConversation.messages : []"
          :key="index"
          :senderType="msg.senderType"
          :senderName="msg.senderName || msg.senderType"
          :message="msg.message"
        />
      </div>

      <ChatInput
        v-model="newMessage"
        @send="sendMessage"
      />
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
import ChatItem from "@/components/ChatItem.vue"
import ChatMessage from "@/components/ChatMessage.vue"
import ChatInput from "@/components/ChatInput.vue";

export default {
  name: "AgentChat",
  components: {
  ChatItem,
  ChatMessage,
  ChatInput,
  },
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
          summary: customerName,
          customerName,
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

      const newMsg = {
        sessionId: this.selectedConversation.sessionId,
        senderId: this.agent.id,
        senderType: "agent",
        message: this.newMessage,
      }

      if (this.selectedConversation) {
        this.selectedConversation.messages.push(newMsg);
      }

      this.socket.emit('send-message', newMsg)
      this.newMessage = "";
      
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
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