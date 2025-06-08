<template>
  <div class="api-method">
    <div class="method-header">
      <span :class="['method-badge', `method-${method.toLowerCase()}`]">
        {{ method }}
      </span>
      <h3>{{ title }}</h3>
    </div>
    
    <div class="api-endpoint">
      <span class="api-endpoint-url">{{ method }} {{ endpoint }}</span>
    </div>
    
    <div v-if="description" class="method-description">
      <p>{{ description }}</p>
    </div>
    
    <div v-if="parameters && parameters.length" class="parameters-section">
      <h4>Параметры</h4>
      <table class="params-table">
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Тип</th>
            <th>Обязательный</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="param in parameters" :key="param.name">
            <td class="param-name">{{ param.name }}</td>
            <td class="param-type">{{ param.type }}</td>
            <td>
              <span v-if="param.required" class="param-required">Да</span>
              <span v-else>Нет</span>
            </td>
            <td>{{ param.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="responses && responses.length" class="responses-section">
      <h4>Ответы</h4>
      <div v-for="response in responses" :key="response.status" class="response-example">
        <span class="response-status">{{ response.status }}</span>
        <p v-if="response.description">{{ response.description }}</p>
      </div>
    </div>
    
    <button v-if="tryItUrl" class="try-it-button" @click="openTryIt">
      Попробовать API
    </button>
  </div>
</template>

<script setup lang="ts">
interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface Response {
  status: string
  description?: string
}

const props = defineProps<{
  method: string
  endpoint: string
  title: string
  description?: string
  parameters?: Parameter[]
  responses?: Response[]
  tryItUrl?: string
}>()

const openTryIt = () => {
  if (props.tryItUrl) {
    window.open(props.tryItUrl, '_blank')
  }
}
</script>

<style scoped>
.api-method {
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.method-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.method-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.method-description {
  margin: 1rem 0;
  color: #6b7280;
}

.parameters-section,
.responses-section {
  margin: 2rem 0;
}

.parameters-section h4,
.responses-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}
</style> 