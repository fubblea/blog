<script setup lang="ts">
import { computed } from 'vue'
import { data as seriesData } from '../theme/series.data'
import { data as postsData } from '../theme/posts.data'

const seriesWithCounts = computed(() => {
  return seriesData.map(series => {
    const seriesFolder = series.url.split('/').filter(Boolean)[0]
    const posts = postsData[seriesFolder] || []
    return {
      ...series,
      postCount: posts.length
    }
  })
})
</script>

<template>
  <div class="series-section">
    <h2 class="section-title">Series</h2>
    <div class="series-grid">
      <a v-for="series in seriesWithCounts" :key="series.url" :href="series.url" class="series-card">
        <h3 class="series-card-title">{{ series.title }}</h3>
        <p v-if="series.description" class="series-card-desc">{{ series.description }}</p>
        <span class="series-post-count">{{ series.postCount }} Posts</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.series-section {
  margin: 4rem 0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  border: none;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.series-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
}

.series-card:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-alt);
  transform: translateY(-4px);
  box-shadow: var(--vp-shadow-3);
}

.series-card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.series-card-desc {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.series-post-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
}
</style>
