<template>
    <div class="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-lg cursor-pointer">
      <!-- Left: Avatar -->
      <div class="flex items-center space-x-3">
        <img
          :src="avatar"
          alt="Avatar"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div class="font-semibold text-gray-900">{{ username }}</div>
          <div class="text-sm text-gray-500 truncate max-w-[200px]">
            {{ lastMessage }}
          </div>
        </div>
      </div>
  
      <!-- Right: New badge -->
      <div v-if="isNew" class="ml-2">
        <span class="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          new
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ChatItem",
    props: {
      username: String,
      lastMessage: String,
      isNew: Boolean,
    },
    data() {
      return {
        avatarList: [
          "/avatars/1.png",
          "/avatars/2.png",
          "/avatars/3.png",
          "/avatars/4.png",
          "/avatars/5.png",
        ],
        avatar: "",
      };
    },
    created() {
      // 随机选择一个头像
      const index = Math.floor(Math.random() * this.avatarList.length);
      this.avatar = this.avatarList[index];
    },
  };
  </script>
  