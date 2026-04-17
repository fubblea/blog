<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { data as postsData } from '../theme/posts.data'
import { data as seriesData } from '../theme/series.data'
import { normalizePath } from '../theme/utils'

const { page } = useData()

const navigation = computed(() => {
  const currentPath = normalizePath('/' + page.value.relativePath)
  const parts = page.value.relativePath.split('/')
  
  // Skip index pages (Series indexes or main indexes)
  if (page.value.relativePath.endsWith('index.md')) {
    return null
  }

  const isSeries = parts.length >= 2
  const seriesId = isSeries ? parts[0] : '_standalone'
  const allPostsInGroup = postsData[seriesId] || []
  const currentIndex = allPostsInGroup.findIndex(p => normalizePath(p.url) === currentPath)

  if (currentIndex === -1) return null

  const prevPost = currentIndex > 0 ? allPostsInGroup[currentIndex - 1] : null
  const nextPost = currentIndex < allPostsInGroup.length - 1 ? allPostsInGroup[currentIndex + 1] : null

  // Find next series if no next post exists in current series
  let nextSeries = null
  if (!nextPost && isSeries) {
    const currentSeriesIndex = seriesData.findIndex(s => s.url === `/${seriesId}/`)
    if (currentSeriesIndex !== -1 && currentSeriesIndex < seriesData.length - 1) {
      nextSeries = seriesData[currentSeriesIndex + 1]
    }
  }

  const groupLabel = isSeries ? 'Series' : 'Collection'

  return {
    isSeries,
    prev: prevPost ? {
      title: prevPost.title,
      url: prevPost.url,
      label: `Previous Post in ${groupLabel} - Post ${currentIndex}/${allPostsInGroup.length}`
    } : null,
    next: nextPost ? {
      title: nextPost.title,
      url: nextPost.url,
      label: `Next Post in ${groupLabel} - Post ${currentIndex + 2}/${allPostsInGroup.length}`
    } : null,
    nextSeries: nextSeries ? {
      title: nextSeries.title,
      url: nextSeries.url
    } : null,
    total: allPostsInGroup.length,
    current: currentIndex + 1
  }
})
</script>

<template>
  <div v-if="navigation" class="post-navigation">
    <div class="nav-links">
      <a v-if="navigation.prev" :href="withBase(navigation.prev.url)" class="nav-card prev">
        <span class="nav-label">{{ navigation.prev.label }}</span>
        <span class="nav-title">← {{ navigation.prev.title }}</span>
      </a>
      <div v-else class="nav-spacer"></div>

      <a v-if="navigation.next" :href="withBase(navigation.next.url)" class="nav-card next">
        <span class="nav-label">{{ navigation.next.label }}</span>
        <span class="nav-title">{{ navigation.next.title }} →</span>
      </a>
      <a v-else-if="navigation.nextSeries" :href="withBase(navigation.nextSeries.url)" class="nav-card next-series">
        <span class="nav-label">No more posts in this series.</span>
        <span class="nav-sublabel">Start reading new series:</span>
        <span class="nav-title">{{ navigation.nextSeries.title }} →</span>
      </a>
      <a v-else :href="withBase('/series')" class="nav-card next-series">
        <span class="nav-label">{{ navigation.isSeries ? 'No more posts in this series.' : 'End of collection.' }}</span>
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
