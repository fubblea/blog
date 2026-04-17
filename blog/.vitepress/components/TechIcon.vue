<script setup lang="ts">
import { getTechIcon } from '../theme/utils'
import { Icon } from '@iconify/vue'
import ModelicaLogo from './ModelicaLogo.vue'
import SolidWorksLogo from './SolidWorksLogo.vue'
import MatlabLogo from './MatlabLogo.vue'

defineProps<{
  tech: string
}>()
</script>

<template>
  <ModelicaLogo v-if="tech.toLowerCase() === 'modelica'" />
  <SolidWorksLogo v-else-if="tech.toLowerCase() === 'solidworks'" />
  <MatlabLogo v-else-if="tech.toLowerCase() === 'matlab'" />
  <Icon v-else-if="getTechIcon(tech)" :icon="getTechIcon(tech)!" />
  <slot v-else name="fallback">
    <span class="tech-fallback">{{ tech }}</span>
  </slot>
</template>

<style scoped>
.tech-fallback {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-mute);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
</style>
