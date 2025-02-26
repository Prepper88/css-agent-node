<template>
  <div class="main-container">
    <!-- Top Section: Agent Information -->
    <div class="agent-info">
      <div class="agent-details">
        <span class="agent-name">{{ agentName }}</span>
        <span class="agent-id">ID: {{ agentId }}</span>
      </div>
      <div class="agent-status">
        <el-select v-model="agentStatus" placeholder="Select status" @change="updateStatus">
          <el-option label="Available" value="available" />
          <el-option label="Busy" value="busy" />
          <el-option label="Offline" value="offline" />
        </el-select>
      </div>
    </div>

    <!-- Bottom Section: Three Columns -->
    <div class="bottom-container">
      <!-- Left Column: Session Switcher -->
      <div class="session-switcher">
        <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.sessionId"
            :label="`Customer ${tab.customerId}`"
            :name="tab.sessionId"
            closable
          />
        </el-tabs>
      </div>

      <!-- Middle Column: Chat Area -->
      <div class="chat-area">
        <div class="chat-window">
          <div v-for="(msg, index) in activeTabMessages" :key="index" class="message" :class="msg.sender">
            <div class="message-content">
              <pre>{{ msg.content }}</pre>
            </div>
            <div class="message-time">
              {{ msg.time }}
            </div>
          </div>
        </div>
        <div class="input-area">
          <el-input
            v-model="inputMessage"
            placeholder="Type a message"
            @keydown.enter="handleKeydown"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 15 }"
            resize="none"
            class="chat-input"
          />
          <el-button type="primary" class="send-button" @click="sendMessage">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- Right Column: Complaint Area -->
      <div class="complaint-area">
        <h3>Complaint Details</h3>
        <div class="complaint-list">
          <div v-for="(complaint, index) in complaints" :key="index" class="complaint-item">
            <div class="complaint-content">
              {{ complaint.content }}
            </div>
            <div class="complaint-time">
              {{ complaint.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowUp } from '@element-plus/icons-vue';
import io from 'socket.io-client';

export default {
  props: {
    agentId: {
      type: Number,
      required: true, // agentId is a required prop
    },
  },
  data() {
    return {
      agentName: 'John Doe', // Agent's name
      agentStatus: 'available', // Agent's status
      activeTab: '', // Currently active tab
      tabs: [], // List of tabs (each representing a session)
      inputMessage: '', // Current input message
      socket: null, // Socket instance
      complaints: [], // List of complaints
    };
  },
  computed: {
    // Get messages for the active tab
    activeTabMessages() {
      const activeTab = this.tabs.find((tab) => tab.sessionId === this.activeTab);
      return activeTab ? activeTab.messages : [];
    },
  },
  mounted() {
    this.initializeSocket();
  },
  methods: {
    // Initialize socket and listen for new sessions
    initializeSocket() {
      // Connect to the Socket.IO server
      this.socket = io('http://localhost:3001'); // Replace with your server URL

      // Send agent-inbound event with agentId
      this.socket.emit('agent-inbound', this.agentId );

      // Listen for new sessions assigned to the agent
      this.socket.on('session-assigned', (data) => {
        console.log('session assigned, sessionId: ' + data.sessionId);
        
        const { sessionId, customerId } = data;
        // Add a new tab for the session
        this.tabs.push({
          sessionId,
          customerId,
          messages: [],
        });
        // Set the new tab as active
        this.activeTab = sessionId;
      });

      // Listen for incoming messages
      this.socket.on('message', (data) => {
        const { sessionId, message, sendName } = data;
        console.log('receive message: ' + message + ' sessionId: ' + sessionId + ' sendName:' + sendName)

        const tab = this.tabs.find((tab) => tab.sessionId === sessionId);
        if (tab) {
          // Add the message to the tab's chat
          tab.messages.push({
            content: message,
            sendName,
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
    // Send message
    sendMessage() {
      if (this.inputMessage.trim() === '') return;
      // Find the active tab
      const activeTab = this.tabs.find((tab) => tab.sessionId === this.activeTab);
      if (activeTab) {
        // Send message through Socket.IO
        this.socket.emit('send-message', {
          sessionId: activeTab.sessionId,
          message: this.inputMessage,
          agentId: this.agentId,
        });
        // Add the message to the active tab's chat
        activeTab.messages.push({
          content: this.inputMessage,
          sender: 'agent',
          time: new Date().toLocaleTimeString(),
        });
        this.inputMessage = '';
        // Scroll to the bottom
        this.$nextTick(() => {
          const chatWindow = this.$el.querySelector('.chat-window');
          if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
        });
      }
    },
    // Handle keyboard events
    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default line break behavior
        this.sendMessage();
      }
      // Allow line break with Shift + Enter
    },
    // Remove a tab
    removeTab(sessionId) {
      this.tabs = this.tabs.filter((tab) => tab.sessionId !== sessionId);
      if (this.activeTab === sessionId) {
        // Switch to the first tab if the active tab is removed
        this.activeTab = this.tabs.length > 0 ? this.tabs[0].sessionId : '';
      }
    },
    // Update agent status
    updateStatus() {
      this.socket.emit('update-status', { status: this.agentStatus });
    },
  },
  components: {
    ArrowUp,
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* Top Section: Agent Information */
.agent-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ebeef5;
}

.agent-details {
  margin-right: 20px;
}

.agent-name {
  font-weight: bold;
}

.agent-id {
  color: #666;
}

.agent-status {
  width: 150px;
}

/* Bottom Section: Three Columns */
.bottom-container {
  display: flex;
  flex: 1;
  margin-top: 10px;
}

/* Left Column: Session Switcher */
.session-switcher {
  width: 15%;
  border-right: 1px solid #ebeef5;
  padding: 10px;
}

/* Middle Column: Chat Area */
.chat-area {
  width: 35%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.message-content {
  padding: 8px;
  border-radius: 4px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.agent .message-content {
  background-color: #409eff;
  color: white;
  margin-left: auto;
}

.customer .message-content {
  background-color: #f0f0f0;
  color: #333;
  margin-right: auto;
}

.input-area {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 10px;
  line-height: 1.5;
  font-size: 14px;
  resize: none;
  overflow-y: auto;
  padding-right: 60px;
}

.send-button {
  position: absolute;
  right: 30px;
  bottom: 30px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Right Column: Complaint Area */
.complaint-area {
  width: 50%;
  padding: 10px;
  border-left: 1px solid #ebeef5;
}

.complaint-list {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.complaint-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.complaint-content {
  font-size: 14px;
}

.complaint-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>