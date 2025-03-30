<template>
  <div class="demo-box" v-if="showAssignTechnician">
    <h2 class="title">Assign a Technician to Customer</h2>
    <p class="subtitle">
      Select the customer's address and preferred time window, and we'll automatically arrange a
      technician and confirm the exact visit time.
    </p>

    <div class="form-row">
      <input type="text" placeholder="John" v-model="firstName" />
      <input type="text" placeholder="Smith" v-model="lastName" />
    </div>
    <!-- Technician visit time range -->
    <div class="form-row">
      <div style="flex: 1">
        <label for="visitStart">Visit Start Time</label>
        <input type="datetime-local" id="visitStart" v-model="visitStart" />
      </div>
      <div style="flex: 1">
        <label for="visitEnd">Visit End Time</label>
        <input type="datetime-local" id="visitEnd" v-model="visitEnd" />
      </div>
    </div>

    <input type="email" placeholder="address" v-model="email" class="input-full" />
    <input type="tel" placeholder="+1 (555) 000-0000" v-model="phone" class="input-full" />

    <button class="submit-btn" @click="assignTechnician">Assign</button>
  </div>

  <div class="demo-box" v-if="showRemindTechnician">
    <h2 class="title">Remind Technician Successfully!</h2>
    <p class="subtitle">
      After you click confirm, the system will send SMS and email notifications to the technician.
      You can also <b>remind them directly using the contact information </b>below.
    </p>

    <div class="info-row">
      <span class="label">Technician Name</span>
      <span class="value">John Simon</span>
    </div>

    <div class="info-row">
      <span class="label">Visit Start Time</span>
      <span class="value">2025-10-23 10:23 AM - 12:00 PM</span>
    </div>

    <div class="info-row">
      <span class="label">Phone</span>
      <span class="value">+1 238 4938 8248</span>
    </div>
    <button class="submit-btn" @click="remindTechnician">OK</button>
  </div>

  <div class="demo-box" v-if="showDelayBilling">
    <h2 class="title">Delay Billing</h2>
    <p class="subtitle">
      Please select the billing start time. You may apply to postpone the billing start date for the
      customer.
    </p>

    <div class="info-row">
      <span class="label" style="font-weight: bold">Bill Id</span>
      <span class="value">38476103</span>
    </div>
    <div style="flex: 1">
      <label for="visitStart" style="text-align: left; font-weight: bold">Visit Start Time</label>
      <input type="datetime-local" id="visitStart" v-model="visitStart" />
    </div>

    <input
      type="email"
      placeholder="Delay Reason"
      style="padding: 10px; margin-top: 20px"
      v-model="email"
      class="input-full"
    />
    <button class="submit-btn" @click="delayBilling">OK</button>
  </div>

  <div class="demo-box" v-if="showRefund">
    <h2 class="title">Refund Application</h2>
    <p class="subtitle">
      Please confirm the refund ID and the reason for the refund. Once the refund is approved, the
      amount is expected to be credited within 7 business days.
    </p>

    <div class="info-row">
      <span class="label" style="font-weight: bold">Order Id</span>
      <span class="value">38476103</span>
    </div>
    <textarea
      type="email"
      placeholder="Refund Reason"
      style="padding: 10px; margin-top: 10px; resize: none"
      v-model="email"
      class="input-full"
    />
    <button class="submit-btn" @click="refund">OK</button>
  </div>
</template>

<script>
import axios from '@/api/axiosInstance.js'

export default {
  name: 'ActionDialog',
  data() {
    return {
      showAssignTechnician: false,
      showRemindTechnician: false,
      showDelayBilling: false,
      showRefund: false,
      visitStart: '',
      visitEnd: '',
      email: '',
      phone: '',
    }
  },
  inject: ['selectedConversation'],
  methods: {
    showAssignTechnicianForm() {
      this.showAssignTechnician = true
    },
    showRemindTechnicianForm() {
      this.showRemindTechnician = true
    },
    showDelayBillingForm() {
      this.showDelayBilling = true
    },
    showRefundForm() {
      this.showRefund = true
    },
    assignTechnician() {
      this.showAssignTechnician = false
      this.$parent.$refs.ticketInfoComponent.executed()
      this.sendServiceProgressCard()
    },
    remindTechnician() {
      this.showRemindTechnician = false
      this.$parent.$refs.ticketInfoComponent.executed()
      this.sendServiceProgressCard()
    },
    delayBilling() {
      this.showDelayBilling = false
      this.$parent.$refs.ticketInfoComponent.executed()
      this.sendServiceProgressCard()
    },
    refund() {
      this.showRefund = false
      this.$parent.$refs.ticketInfoComponent.executed()
      this.sendServiceProgressCard()
    },
    sendServiceProgressCard() {
      axios.get('/api/message/send-service-progress-card', {
        params: {
          sessionId: this.selectedConversation.sessionId,
        },
      })
    },
  },
}
</script>
<style scoped>
.demo-box {
  width: 100%;
  max-width: 420px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  /* 去掉橘色边框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #ee2222;
  text-align: left;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='datetime-local'] {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.input-full {
  width: 100%;
  margin-bottom: 10px;
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #444;
}

.checkbox-row a {
  color: #e85e00;
  text-decoration: underline;
}

input[type='checkbox'] {
  margin-top: 3px;
}

.submit-btn {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 12px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #449944;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
  margin-bottom: 10px;
}

.info-row .label {
  font-weight: 500;
  color: #666;
}

.info-row .value {
  font-weight: 600;
  color: #111;
}
</style>
