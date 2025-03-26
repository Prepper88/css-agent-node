<template>
  <section class="card">
    <div class="card-header"><h3>Ticket Workflow</h3></div>
    <div class="card-body">
      <TicketWorkflow :current-step="1"></TicketWorkflow>
      <div class="section-container" @submit.prevent="submitForm">
        <div class="row-2">
          <div class="section-group">
            <label>Issue Type</label>
            <select class="input full">
              <option disabled selected>Select country</option>
              <option>United States</option>
              <option>Canada</option>
              <option>China</option>
              <option>India</option>
            </select>
          </div>
          <div class="section-group">
            <label>Issue</label>
            <select class="input full">
              <option disabled selected>Select country</option>
              <option>United States</option>
              <option>Canada</option>
              <option>China</option>
              <option>India</option>
            </select>
          </div>
        </div>

        <div class="section-group">
          <label>Remark</label>
          <textarea type="text" rows="5" placeholder="e.g Irakli Beridze" class="textarea full" />
        </div>

        <button type="button" class="submit-button">Confirmed Issue With Client</button>
      </div>

      <div class="section-container" @submit.prevent="submitForm">
        <div class="section-group">
          <label>User Request</label>
          <textarea type="text" rows="5" placeholder="e.g Irakli Beridze" class="textarea full" />
        </div>
        <div class="section-group">
          <label>Confirmed Solution</label>
          <textarea type="text" rows="5" placeholder="e.g Irakli Beridze" class="textarea full" />
        </div>

        <button type="button" class="submit-button">Confirm Solution With Client</button>
      </div>
    </div>
  </section>
</template>

<script>
import TicketWorkflow from './TicketWorkflow.vue'
import Test from './Test.vue'

export default {
  components: { TicketWorkflow, Test },
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
    }
  },
}
</script>

<style lang="css" scoped>
.card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 0px 16px 12px 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.section-container {
  width: 90%;
  border: 1px solid #ddd;
  border-radius: 12px;
  max-width: 100%;
  margin: auto;
  padding: 20px;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row-2,
.row-3 {
  display: flex;
  gap: 12px;
}

.row-2 .section-group,
.row-3 .section-group {
  flex: 1;
}

.section-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
  color: #333;
  text-align: left; /* ✅ 确保 label 左对齐 */
}

.input {
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  width: 100%;
}

.textarea {
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  width: 100%;
  resize: none;
}

.full {
  width: 100%;
}

.submit-button {
  margin-top: 8px;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover {
  background-color: #0069d9;
}
</style>
