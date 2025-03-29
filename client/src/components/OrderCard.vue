<template>
  <div class="order-card" :class="{ disabled, selected }">
    <div class="order-info">
      <div class="order-header">
        <span class="order-id">order #{{ orderId }}</span>
        <span>{{ orderTitle }}</span>
      </div>
      <div class="order-date">{{ createdAt }}</div>
      <div class="order-status" :class="statusClass(payStatus)">
        {{ payStatus }}
      </div>
      <div class="order-status" :class="statusClass(deliveryStatus)">
        {{ deliveryStatus }}
      </div>
    </div>
    <div class="order-meta">
      <span class="order-image">
        <img :src="getImageUrl(imageName)" :alt="orderTitle" />
      </span>
      <div class="order-price">${{ price }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    id: Number,
    orderId: String,
    orderTitle: String,
    createdAt: String,
    payStatus: String,
    deliveryStatus: String,
    imageName: String,
    price: String,
    selected: Boolean,
    disabled: Boolean,
  },
  data() {},
  methods: {
    getImageUrl(name) {
      try {
        return new URL(`../assets/${name}`, import.meta.url).href
      } catch {
        return ''
      }
    },
    statusClass(status) {
      return 'status-' + status
    },
  },
}
</script>

<style scoped>
.order-card {
  display: flex;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  align-items: flex-start;
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.2s;
}
.order-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.order-card.selected {
  border: 2px solid #4caf50;
  background-color: #f0fdf4;
  pointer-events: none;
  opacity: 0.9;
}
.order-info {
  flex: 1;
}
.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #000;
}
.order-id {
  margin-right: 12px;
  white-space: nowrap;
}
.order-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}
.order-status {
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}
.status-支付完成,
.status-paid {
  background-color: #e6f4ea;
  color: #2e7d32;
}
.status-已送达,
.status-delivered {
  background-color: #fff3e0;
  color: #ef6c00;
}
.order-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.order-image img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
}
.order-price {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}
.order-card.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
