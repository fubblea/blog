<script setup lang="ts">
import { useCitations } from '../theme/useCitations'
import { data as allRefs } from '../theme/refs.data'
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const { citations } = useCitations()

const citedRefs = computed(() => {
  if (citations.value.length === 0) return []
  return citations.value.map((id, index) => {
    const entry = allRefs[id]
    return {
      id,
      index: index + 1,
      formatted: entry ? entry.formatted : `Missing reference: ${id}`
    }
  })
})
</script>

<template>
  <section v-if="citedRefs.length" class="references-section">
    <div class="divider"></div>
    <h2 id="references">References</h2>
    <div class="reference-list">
      <div v-for="ref in citedRefs" :key="ref.id" :id="'ref-' + ref.id" class="reference-item">
        <span class="reference-number">[{{ ref.index }}]</span>
        <div class="reference-content" v-html="ref.formatted"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.references-section {
  margin-top: 4rem;
}

.divider {
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 1.5rem;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.reference-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reference-item {
  display: flex;
  gap: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  scroll-margin-top: 100px;
}

.reference-number {
  flex-shrink: 0;
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 1.5rem;
}

.reference-content {
  flex: 1;
}
</style>
