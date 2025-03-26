<template>
    <section class="card">
        <div class="card-header">
          <h3>{{ cardname }}</h3>
          <div class="badges">
            <span v-for="(tag, index) in tags" :key="index" :class="['badge', tag.level]">{{ tag.name }}</span>
          </div>
        </div>
        <div class="card-body grid-2">
            <div v-for="(field, index) in fields" :key="index" class="field">
                <label class="field-label">{{ field.label }}:</label>
                <span class="field-value">{{ field.value }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import { computed } from 'vue';

export default {
  name: "InfoCard",
  props: {
    cardname: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
    },
    computed: {
    }
  },
};
</script>

<style scoped>
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
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .badges {
    display: flex;
    gap: 6px;
  }
  .badge {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .badge.warning {
    background: #fff3cd;
    color: #856404;
  }
  .badge.error {
    background: #f8d7da;
    color: #721c24;
  }

  .field {
    display: flex;
    align-items: center;
  }
  .field-label {
    width: 100px;
    font-weight: bold;
    text-align: left;
  }
  .field-value {
    flex: 1;
    text-align: left;
  }
  
</style>