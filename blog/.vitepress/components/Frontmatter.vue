<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { data as seriesData } from '../theme/series.data'
import { data as postsData } from '../theme/posts.data'
import { getTechIcon, normalizePath, formatDate, type PageFrontmatter } from '../theme/utils'
import { Icon } from '@iconify/vue'
import ModelicaLogo from './ModelicaLogo.vue'

const { page, frontmatter } = useData<PageFrontmatter>()

const seriesInfo = computed(() => {
  const parts = page.value.relativePath.split('/')
  if (parts.length < 2) return null
  
  const seriesFolder = parts[0]
  const allPosts = postsData[seriesFolder] || []
  
  const searchUrl = `/${seriesFolder}/`
  const seriesMeta = seriesData.find(s => s.url === searchUrl)
  
  if (!seriesMeta) return null

  const currentPath = normalizePath('/' + page.value.relativePath)
  const currentIndex = allPosts.findIndex(p => normalizePath(p.url) === currentPath) + 1

  return {
    title: seriesMeta.title,
    url: seriesMeta.url,
    current: currentIndex,
    total: allPosts.length
  }
})

const tags = computed(() => frontmatter.value.tags || [])
const tech = computed(() => frontmatter.value.tech || [])

const dateWritten = computed(() => formatDate(frontmatter.value['date-written']))
const lastUpdated = computed(() => formatDate(frontmatter.value['last-updated']))
</script>

<template>
  <header class="title-header">
    <div class="header-content">
      <div v-if="seriesInfo && seriesInfo.current > 0" class="series-badge">
        Part {{ seriesInfo.current }}/{{ seriesInfo.total }} of 
        <a :href="withBase(seriesInfo.url)" class="series-link">{{ seriesInfo.title }}</a>
      </div>
      
      <div class="header-meta">
        <div v-if="tags.length" class="tag-list">
          <a v-for="tag in tags" :key="tag" :href="withBase('/all-posts?tag=' + encodeURIComponent(tag))" class="tag-item">#{{ tag }}</a>
        </div>

        <div v-if="tech.length" class="tech-row">
          <a v-for="t in tech" :key="t" :href="withBase('/all-posts?tech=' + encodeURIComponent(t))" class="tech-logo" :title="t">
            <ModelicaLogo v-if="t.toLowerCase() === 'modelica'" />
            <Icon v-else-if="getTechIcon(t)" :icon="getTechIcon(t)!" />
            <span v-else class="tech-fallback">{{ t }}</span>
          </a>
        </div>

        <div v-if="dateWritten || lastUpdated" class="date-row">
          <span v-if="dateWritten" class="date-item">
            <span class="date-label">Written:</span> {{ dateWritten }}
          </span>
          <span v-if="lastUpdated" class="date-item">
            <span class="date-label">Updated:</span> {{ lastUpdated }}
          </span>
        </div>
      </div>
    </div>
    <div class="header-divider"></div>
  </header>
</template>

<style scoped>
.header-content {
  max-width: 100%;
}

.series-link {
  color: var(--vp-c-brand);
  text-decoration: none;
}
.series-link:hover {
  text-decoration: underline;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.tag-item {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  opacity: 0.8;
  text-decoration: none;
}
.tag-item:hover {
  opacity: 1;
  text-decoration: underline;
}

.tech-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--vp-c-divider);
}

.tech-logo {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.tech-fallback {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-mute);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.date-row {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.date-label {
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-right: 0.25rem;
}

@media (max-width: 960px) {
  .date-row {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .header-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .tech-row {
    padding-left: 0;
    border-left: none;
  }
}
</style>
