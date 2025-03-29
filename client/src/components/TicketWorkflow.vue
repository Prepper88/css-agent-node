<template>
  <div class="progress-container">
    <div class="progress-line"></div>
    <div class="steps">
      <div
        v-for="(step, index) in statusFlow"
        :key="index"
        class="step-item"
        :class="{ active: currentIndex >= index }"
      >
        <div class="circle">
          <span v-if="currentIndex >= index">✔</span>
        </div>
        <div class="label">{{ step }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentStatus: String,
    statusFlow: Array,
  },
  computed: {
    currentIndex() {
      return this.statusFlow.indexOf(this.internalStatus)
    },
  },
  methods: {
    changeStatus(status) {
      this.internalStatus = status
    },
  },
  data() {
    return {
      internalStatus: this.currentStatus,
    }
  },
}
</script>

<style lang="css" scoped>
.progress-container {
  position: relative;
  margin: 20px 0;
  padding-top: 24px;
}
.progress-line {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  height: 2px;
  background: #cbd5e0;
  z-index: 1;
}
.steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #666;
}
.step-item .circle {
  width: 24px;
  height: 24px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  z-index: 3;
}
.step-item.active .circle {
  background: #3182ce;
  color: white;
  font-weight: bold;
}
.step-item .label {
  max-width: 80px;
  line-height: 1.2;
  word-break: break-word;
}
</style>
