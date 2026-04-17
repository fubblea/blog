<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { data as postsData } from '../theme/posts.data'
import { data as seriesData } from '../theme/series.data'
import { normalizePath } from '../theme/utils'

const { page } = useData()

const navigation = computed(() => {
  const currentPath = normalizePath('/' + page.value.relativePath)
  const parts = page.value.relativePath.split('/')
  
  // Only show navigation for posts (which are inside a series folder)
  if (parts.length < 2 || page.value.relativePath.endsWith('index.md')) {
    return null
  }

  const seriesFolder = parts[0]
  const allPostsInSeries = postsData[seriesFolder] || []
  const currentIndex = allPostsInSeries.findIndex(p => normalizePath(p.url) === currentPath)

  if (currentIndex === -1) return null

  const prevPost = currentIndex > 0 ? allPostsInSeries[currentIndex - 1] : null
  const nextPost = currentIndex < allPostsInSeries.length - 1 ? allPostsInSeries[currentIndex + 1] : null

  // Find next series if no next post exists
  let nextSeries = null
  if (!nextPost) {
    const currentSeriesIndex = seriesData.findIndex(s => s.url === `/${seriesFolder}/`)
    if (currentSeriesIndex !== -1 && currentSeriesIndex < seriesData.length - 1) {
      nextSeries = seriesData[currentSeriesIndex + 1]
    }
  }

  return {
    prev: prevPost ? {
      title: prevPost.title,
      url: prevPost.url,
      label: `Go to Previous Post in Series - Post ${currentIndex}/${allPostsInSeries.length}`
    } : null,
    next: nextPost ? {
      title: nextPost.title,
      url: nextPost.url,
      label: `Go to Next Post in Series - Post ${currentIndex + 2}/${allPostsInSeries.length}`
    } : null,
    nextSeries: nextSeries ? {
      title: nextSeries.title,
      url: nextSeries.url
    } : null,
    total: allPostsInSeries.length,
    current: currentIndex + 1
  }
})
</script>

<template>
  <div v-if="navigation" class="post-navigation">
    <div class="nav-links">
      <a v-if="navigation.prev" :href="navigation.prev.url" class="nav-card prev">
        <span class="nav-label">{{ navigation.prev.label }}</span>
        <span class="nav-title">← {{ navigation.prev.title }}</span>
      </a>
      <div v-else class="nav-spacer"></div>

      <a v-if="navigation.next" :href="navigation.next.url" class="nav-card next">
        <span class="nav-label">{{ navigation.next.label }}</span>
        <span class="nav-title">{{ navigation.next.title }} →</span>
      </a>
      <a v-else-if="navigation.nextSeries" :href="navigation.nextSeries.url" class="nav-card next-series">
        <span class="nav-label">No more posts in this series.</span>
        <span class="nav-sublabel">Start reading new series:</span>
        <span class="nav-title">{{ navigation.nextSeries.title }} →</span>
      </a>
      <a v-else href="/series" class="nav-card next-series">
        <span class="nav-label">No more posts in this series.</span>
        <span class="nav-title">Explore other series →</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.post-navigation {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.nav-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.nav-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, background-color 0.25s;
  background-color: var(--vp-c-bg-soft);
}

.nav-card:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-mute);
}

.prev {
  text-align: left;
}

.next, .next-series {
  text-align: right;
  align-items: flex-end;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.nav-sublabel {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.nav-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
}

@media (max-width: 640px) {
  .nav-links {
    grid-template-columns: 1fr;
  }
}
</style>
