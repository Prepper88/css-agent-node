<template>
  <div class="page-vertical">
    <div class="scroll-container">
      <!-- Customer Info -->
      <InfoCard :cardName="customerInfoCard.cardName" :fields="customerInfoCard.fields"></InfoCard>

      <!-- Order Info -->
      <InfoCard
        :card-name="orderInfoCard.cardName"
        :fields="orderInfoCard.fields"
        :tags="orderInfoCard.tags"
      ></InfoCard>

      <!-- Install Info -->
      <InfoCard :card-name="extraInfoCard.cardName" :fields="extraInfoCard.fields"></InfoCard>

      <!-- Ticket Info -->
      <TicketInfoCard :ticket="ticket" ref="ticketInfoComponent"></TicketInfoCard>
    </div>

    <ActionDialog ref="actionDialog" :showAssignTechnician="showAssignTechnician"></ActionDialog>

    <!-- Bottom Actions -->
    <div class="actions-bar">
      <button>Re-select Order</button>
      <button @click="$refs.actionDialog.showAssignTechnicianForm">Assign Technician</button>
      <button @click="$refs.actionDialog.showRemindTechnicianForm">Remind Technician</button>
      <button @click="$refs.actionDialog.showDelayBillingForm">Delay Billing</button>
      <button @click="$refs.actionDialog.showRefundForm">Refund</button>
      <button @click="resolved">Confirm Resolved</button>
    </div>
  </div>
</template>

<script>
import ActionDialog from './ActionDialog.vue'
import InfoCard from './InfoCard.vue'
import TicketInfoCard from './TicketInfoCard.vue'
import axios from 'axios'

const JAVA_END_URL_PREFIX = 'http://localhost:8080'
export default {
  components: { InfoCard, TicketInfoCard, ActionDialog },
  props: {
    customerInfoCard: Object,
    orderInfoCard: Object,
    extraInfoCard: Object,
    ticket: Object,
  },
  data() {
    return {
      showAssignTechnician: false,
    }
  },
  inject: ['selectedConversation'],
  methods: {
    resolved() {
      this.$refs.ticketInfoComponent.resolved()
      //this.sendServiceProgressCard(this.selectedConversation.sessionId)
      setTimeout(() => {
        this.sendServiceProgressCard(this.selectedConversation.sessionId)
      }, 500)
    },
    sendServiceProgressCard(sessionId) {
      axios.get(JAVA_END_URL_PREFIX + '/api/message/send-service-progress-card', {
        params: {
          sessionId,
        },
      })
    },
  },
}
</script>

<style scoped>
.page-vertical {
  height: 95%;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  font-size: 14px;
}
.scroll-container {
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

button {
  padding: 6px 12px;
  margin-top: 6px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.actions-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 16px;
  background: #ffffff;
}
.actions-bar button {
  background: #e2e8f0;
  color: #333;
  font-size: 13px;
}
</style>
