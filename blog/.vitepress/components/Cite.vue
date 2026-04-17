<script setup lang="ts">
import { useCitations } from '../theme/useCitations'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const { register } = useCitations()

const ids = props.id.split(',').map(s => s.trim()).filter(Boolean)

const citations = computed(() => {
  // Register the IDs and get their indices
  const indices = register(props.id)
  return ids.map((id, i) => ({
    id,
    index: indices[i]
  }))
})
</script>

<template>
  <span class="cite">
    [<template v-for="(cite, i) in citations" :key="cite.id">
      <a :href="'#ref-' + cite.id" class="cite-link">{{ cite.index || '?' }}</a>
      <span v-if="i < citations.length - 1">, </span>
    </template>]
  </span>
</template>

<style scoped>
.cite {
  white-space: nowrap;
  font-size: 0.9em;
  vertical-align: super;
}
.cite-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}
.cite-link:hover {
  text-decoration: underline;
}
</style>
