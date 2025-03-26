<template>
  <div class="page-vertical">
    <div class="scroll-container">
      <!-- Customer Info -->
      <InfoCard :cardname="customerInfoCard.cardname" :fields="customerInfoCard.fields"></InfoCard>

      <!-- Order Info -->
      <InfoCard
        :cardname="orderInfoCard.cardname"
        :fields="orderInfoCard.fields"
        :tags="orderInfoCard.tags"
      ></InfoCard>

      <!-- Install Info -->
      <InfoCard :cardname="installInfoCard.cardname" :fields="installInfoCard.fields"></InfoCard>

      <!-- Ticket Info -->
      <TicketInfoCard></TicketInfoCard>
    </div>

    <!-- Bottom Actions -->
    <div class="actions-bar">
      <button>Re-select Order</button>
      <button>Assign Technician</button>
      <button>Remind Technician</button>
      <button>Delay Billing</button>
      <button>Refund</button>
      <button>Confirm Resolved</button>
    </div>
  </div>
</template>

<script>
import InfoCard from './InfoCard.vue'
import TicketInfoCard from './TicketInfoCard.vue'

export default {
  components: { InfoCard, TicketInfoCard },
  data() {
    return {
      issueType: '',
      issue: '',
      description: '',
      userRequest: '',
      solution: '',
      currentStep: 2,
      statusFlow: [
        'Created',
        'Issue Clarified',
        'Solution Confirmed',
        'Executing',
        'Completed',
        'Resolved',
        'Feedback Received',
      ],
      customerInfoCard: {
        cardname: 'Customer Info',
        fields: [
          {
            label: 'Name',
            value: 'John Green',
          },
          {
            label: 'Email',
            value: 'John Doe@example.com',
          },
          {
            label: 'Phone',
            value: '+1 123-456-7890',
          },
          {
            label: 'Tax Status',
            value: 'Tax Exempt',
          },
        ],
      },
      orderInfoCard: {
        cardname: 'Order Info',
        tags: [
          {
            name: 'Pending Payment',
            level: 'warning',
          },
          {
            name: 'Not Installed',
            level: 'error',
          },
        ],
        fields: [
          {
            label: 'Order Id',
            value: '#B123456789',
          },
          {
            label: 'Order Name',
            value: 'Distribute $50 500M Plan',
          },
          {
            label: 'Business Type',
            value: 'Broadband',
          },
          {
            label: 'Order Time',
            value: '2025-03-25 14:20',
          },
          {
            label: 'Payment Time',
            value: '2025-03-25 14:20',
          },
          {
            label: 'Activation Time',
            value: '2025-03-25 14:20',
          },
          {
            label: 'Payment Status',
            value: 'paid',
          },
        ],
      },
      installInfoCard: {
        cardname: 'Install Info',
        fields: [
          {
            label: 'Technician Name',
            value: 'Bill Jome',
          },
          {
            label: 'Technician Phone',
            value: '+1 888-555-9999',
          },
          {
            label: 'Appointment Time',
            value: '2025-03-26 11:30',
          },
          {
            label: 'Completed At',
            value: '---',
          },
        ],
      },
    }
  },
  methods: {},
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
