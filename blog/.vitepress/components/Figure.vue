<template>
  <figure :id="label ? 'fig-' + label : undefined" class="custom-figure">
    <img :src="src" :alt="caption" class="figure-img" />
    <figcaption class="figure-caption">
      <span class="figure-number">Figure {{ number > 0 ? number : '?' }}: </span>
      <span class="caption-text">{{ caption }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFigures } from '../theme/useFigures'

const props = defineProps<{
  src: string;
  caption: string;
  label?: string;
}>();

const { register } = useFigures()

// Registers the figure in document order and retrieves its sequential number
// Using src as fallback ID ensures idempotency if label is missing
const number = computed(() => register(props.label || props.src))
</script>

<style scoped>
.custom-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.figure-img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.figure-caption {
  margin-top: 0.75rem;
  text-align: center;
  opacity: 0.8;
  font-style: italic;
  font-size: 0.9rem;
}

.figure-number {
  font-weight: 600;
  font-style: normal;
}

.caption-text {
  /* Inherits styling from parent .figure-caption */
}
</style>
