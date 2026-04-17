<script setup lang="ts">
import { useFigures } from '../theme/useFigures'
import { computed } from 'vue'

const props = defineProps<{ id: string }>()
const { getNumber } = useFigures()

const number = computed(() => getNumber(props.id))
</script>

<template>
  <a :href="'#fig-' + id" class="fig-ref">Figure {{ number > 0 ? number : '?' }}</a>
</template>

<style scoped>
.fig-ref {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}
.fig-ref:hover {
  text-decoration: underline;
}
</style>
