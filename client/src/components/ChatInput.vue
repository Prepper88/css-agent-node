<!-- src/components/ChatInput.vue -->
<template>
    <div class="chat-input">
      <textarea
        v-model="message"
        placeholder="Type a message..."
        @keydown.enter.exact.prevent="onEnter"
        @keydown.shift.enter.exact.stop
        rows="1"
        class="chat-textarea"
      ></textarea>
      <button @click="onEnter" class="send-button">Send</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ChatInput",
    props: {
      modelValue: String,
    },
    emits: ["update:modelValue", "send"],
    computed: {
      message: {
        get() {
          return this.modelValue;
        },
        set(val) {
          this.$emit("update:modelValue", val);
        },
      },
    },
    methods: {
      onEnter() {
        const trimmed = this.message.trim();
        if (trimmed) {
          this.$emit("send", trimmed);
          this.message = ""; // 清空输入
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-input {
    align-items: center; 
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px;
    /* border-top: 1px solid #ddd; */
  }
  
  .chat-textarea {
    height: 30px;
    flex: 1;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 14px;
    line-height: 1.4;
    font-family: inherit;
    outline: none;
  }
  
  .send-button {
    height: 43px;
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .send-button:hover {
    background-color: #43a047;
  }
  </style>
  