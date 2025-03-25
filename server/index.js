const express = require('express')
const http = require('http')
const axios = require('axios')
const cors = require('cors')
const qs = require('qs')
const { Server } = require('socket.io')
const path = require('path')

const app = express()
// TODO: remove in the future
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// 提供静态文件（Vue 前端）
app.use(express.static(path.join(__dirname, '../client/dist')))

// 存储坐席的 Socket 连接
const agents = new Map() // key: agentId, value: socket
const agentQueue = [] // 空闲坐席队列
const JAVA_END_URL_PREFIX = 'http://localhost:8080'


io.on('connection', (socket) => {
  console.log('a user connected:', socket.id)

  // bind agentId with socket and initial session
  socket.on('agent-inbound', async (agentId) => {
    // bind agentId with socket
    agents.set(agentId, socket)

    // update agent status
    await updateAgentStatus(agentId, 'available')
    console.log('update agent status, agentId:' + agentId + ' status: available')

    // load sessions
    await loadSessions(agentId)
    console.log('load session complete')
  })

  // 消息转发
  socket.on('send-message', async ({ senderId, sessionId, message }) => {
    await sendMessage(sessionId, message, senderId)
  })

  // 断开连接
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
    // 清理坐席的连接
    for (const [agentId, agentSocket] of agents) {
      if (agentSocket.id === socket.id) {
        agents.delete(agentId)
        const index = agentQueue.indexOf(agentId)
        if (index !== -1) agentQueue.splice(index, 1)
        break
      }
    }
  })
})

// send message
async function sendMessage(sessionId, message, senderId) {
  const data = {
    senderId,
    senderType: 'agent',
    sessionId,
    message,
  }
  const url = JAVA_END_URL_PREFIX + '/api/message/send'

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json', // 设置请求头
      },
    })

    return response
  } catch (error) {
    console.log('send message error: ' + error)
  }
}

async function updateAgentStatus(agentId, status) {
    const data = {
      agentId: agentId,
      status: status,
    }
    const url = JAVA_END_URL_PREFIX + '/api/agent/update-status?' + qs.stringify(data)
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json', // 设置请求头
        },
      })
  
      // Find the socket for the agent
      const socket = agents.get(agentId);
      socket.emit('agent-status-updated', 'available')
      return response
    } catch (error) {
      console.log('update agent status error: ' + error)
    }
  }

  async function loadSessions(agentId) {
    const data = {
      agentId: agentId
    }
    const url = JAVA_END_URL_PREFIX + '/api/session/loadSessionForAgent?' + qs.stringify(data)
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json', // 设置请求头
        },
      })
  
      // Find the socket for the agent
      const socket = agents.get(agentId);
      socket.emit('session-loaded', response.data)
      return response
    } catch (error) {
      console.log('update agent status error: ' + error)
    }
  }

// HTTP API for pushing messages to agents
app.post('/api/push-message', (req, res) => {
    const { sessionId, senderId, senderType, agentId, message } = req.body;
    console.log('push message, sendTo: ' + senderId + ' message:' + message)
  
    // Find the socket for the agent
    const socket = agents.get(agentId);
    if (socket) {
      // Send the message to the agent
      socket.emit('message', {
        sessionId,
        senderId,
        senderType,
        message,
        time: new Date().toLocaleTimeString(),
      });
      res.status(200).json({ success: true, message: 'Message sent to agent' });
    } else {
      res.status(404).json({ success: false, message: 'Agent not connected' });
    }
  });

  // HTTP API for notifying agents about new sessions
app.post('/api/notify-new-session', (req, res) => {
    const { agentId, sessionId, customerId, customerName, status, messages } = req.body;
  
    // Find the socket for the agent
    const socket = agents.get(agentId);
    if (socket) {
      // Send new-session event to the agent
      socket.emit('new-session', { sessionId, customerId, customerName, status, messages });
      res.status(200).json({ success: true, message: 'New session notification sent to agent' });
    } else {
      res.status(404).json({ success: false, message: 'Agent not connected' });
    }
  });

// 启动服务器
const PORT = 3001
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
