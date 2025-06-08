<template>
  <div class="code-block-wrapper">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'text'
  }
})

const renderedContent = computed(() => {
  // Безопасно рендерим контент без Vue template parsing
  const safeContent = props.content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\${/g, '${')
  
  return `<pre><code class="language-${props.language}">${safeContent}</code></pre>`
})
</script>

<style scoped>
.code-block-wrapper {
  margin: 1rem 0;
}

.code-block-wrapper pre {
  background: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.45;
}

.code-block-wrapper code {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: #24292e;
}
</style> 