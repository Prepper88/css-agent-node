<template>
  <div class="order-list-container">
    <div class="order-list">
      <OrderCard
        class="order-card"
        v-for="(order, index) in orders"
        :key="index"
        :selected="selectedOrderId === order.orderId"
        :id="order.id"
        :order-id="order.orderId"
        :order-title="order.orderTitle"
        :price="order.price"
        :pay-status="order.payStatus"
        :delivery-status="order.deliveryStatus"
        :created-at="order.createdAt"
        :image-name="order.imageName"
        :disabled="disabled"
      ></OrderCard>
    </div>
  </div>
</template>

<script>
import OrderCard from './OrderCard.vue'

export default {
  name: 'OrderList',
  components: { OrderCard },
  props: {
    orders: Array,
  },
  data() {
    return {
      selectedOrderId: null,
    }
  },
  computed: {
    disabled() {
      return true
    },
  },
  inject: ['sendOrderCard'],
  methods: {
    selectOrder(orderId) {
      if (this.selectedOrderId === null) {
        this.selectedOrderId = orderId
      }
      const orderCard = this.orders.find((order) => order.orderId === this.selectedOrderId)
      this.sendOrderCard(orderCard)
    },
  },
}
</script>

<style scoped>
.order-list-container {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
