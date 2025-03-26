<template>
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
</template>

<script>
export default {
  name: 'SubscribeForm',
  methods: {
    submitForm() {
      alert('Subscribed!')
    },
  },
}
</script>

<style scoped>
.section-container {
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
