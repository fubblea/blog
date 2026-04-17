<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

const displayLink = computed(() => {
  // Remove protocol and domain if present
  let path = props.url.replace(/^https?:\/\/(www\.)?github\.com\//, '')
  // Remove trailing slash
  path = path.replace(/\/$/, '')
  return path
})

const href = computed(() => {
  if (props.url.startsWith('http')) {
    return props.url
  }
  return `https://github.com/${displayLink.value}`
})
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="github-link">
    <svg class="github-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
      <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
    <span class="github-text">{{ displayLink }}</span>
  </a>
</template>

<style scoped>
.github-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--vp-c-bg-soft);
  padding: 0px 6px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  text-decoration: none !important;
  color: var(--vp-c-text-1);
  transition: background-color 0.2s;
  border: 1px solid var(--vp-c-divider);
  vertical-align: middle;
  margin: 0 2px;
}

.github-link:hover {
  background-color: var(--vp-c-gray-soft);
  color: var(--vp-c-brand-1);
}

.github-icon {
  width: 14px;
  height: 14px;
}

.github-text {
  font-weight: 500;
}
</style>
