<template>
  <div class="api-layout">
    <div class="api-content">
      <div class="api-nav">
        <h4>На этой странице</h4>
        <ul>
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" @click="scrollToSection(section.id)">
              {{ section.title }}
            </a>
          </li>
        </ul>
      </div>
      
      <slot name="content"></slot>
    </div>
    
    <div class="api-examples">
      <div class="code-tabs">
        <button 
          v-for="lang in languages" 
          :key="lang.id"
          :class="['code-tab', { active: activeLanguage === lang.id }]"
          @click="setActiveLanguage(lang.id)"
        >
          {{ lang.name }}
        </button>
      </div>
      
      <div class="examples-content">
        <slot name="examples"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Section {
  id: string
  title: string
}

interface Language {
  id: string
  name: string
}

const props = defineProps<{
  sections?: Section[]
  languages?: Language[]
}>()

const activeLanguage = ref('curl')
const sections = ref(props.sections || [])
const languages = ref(props.languages || [
  { id: 'curl', name: 'cURL' },
  { id: 'go', name: 'Go' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'php', name: 'PHP' }
])

const setActiveLanguage = (langId: string) => {
  activeLanguage.value = langId
  
  // Показываем/скрываем соответствующие блоки кода
  const codeBlocks = document.querySelectorAll('.example-block')
  codeBlocks.forEach(block => {
    const blockLang = block.getAttribute('data-lang')
    if (blockLang === langId) {
      (block as HTMLElement).style.display = 'block'
    } else {
      (block as HTMLElement).style.display = 'none'
    }
  })
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  // Автоматически извлекаем секции из заголовков
  if (!props.sections) {
    const headings = document.querySelectorAll('.api-content h2, .api-content h3')
    const extractedSections: Section[] = []
    
    headings.forEach(heading => {
      if (heading.id) {
        extractedSections.push({
          id: heading.id,
          title: heading.textContent || ''
        })
      }
    })
    
    sections.value = extractedSections
  }
  
  // Инициализируем отображение первого языка
  setActiveLanguage(activeLanguage.value)
  
  // Добавляем кнопки копирования к блокам кода
  addCopyButtons()
})

const addCopyButtons = () => {
  const codeBlocks = document.querySelectorAll('.api-examples pre')
  codeBlocks.forEach(block => {
    if (!block.querySelector('.copy-button')) {
      const copyButton = document.createElement('button')
      copyButton.className = 'copy-button'
      copyButton.textContent = 'Copy'
      copyButton.onclick = () => copyCode(block, copyButton)
      
      const wrapper = document.createElement('div')
      wrapper.className = 'api-code-block'
      block.parentNode?.insertBefore(wrapper, block)
      wrapper.appendChild(block)
      wrapper.appendChild(copyButton)
    }
  })
}

const copyCode = (codeBlock: Element, button: HTMLButtonElement) => {
  const code = codeBlock.textContent || ''
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!'
    setTimeout(() => {
      button.textContent = 'Copy'
    }, 2000)
  })
}
</script>

<style scoped>
.examples-content {
  margin-top: 0;
}

.example-block {
  margin: 1rem 0;
}

.example-block[data-lang]:not([data-lang="curl"]) {
  display: none;
}
</style> 