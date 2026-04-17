<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, computed, onMounted } from 'vue'
import { data as postsData } from '../theme/posts.data'
import { data as seriesData } from '../theme/series.data'
import { getTechIcon, formatDate } from '../theme/utils'
import { Icon } from '@iconify/vue'
import ModelicaLogo from './ModelicaLogo.vue'

const selectedTags = ref<string[]>([])
const selectedTech = ref<string[]>([])

// Get all unique tags and tech from all posts
const allTags = computed(() => {
  const tags = new Set<string>()
  Object.values(postsData).flat().forEach(post => post.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const allTech = computed(() => {
  const tech = new Set<string>()
  Object.values(postsData).flat().forEach(post => post.tech.forEach(t => tech.add(t)))
  return Array.from(tech).sort()
})

const filteredSeries = computed(() => {
  const result: any[] = []
  
  // 1. Handle Series
  seriesData.forEach(series => {
    const seriesFolder = series.url.split('/').filter(Boolean)[0]
    const posts = postsData[seriesFolder] || []
    
    const filteredPosts = posts.filter(post => {
      const matchTag = selectedTags.value.length === 0 || selectedTags.value.some(t => post.tags.includes(t))
      const matchTech = selectedTech.value.length === 0 || selectedTech.value.some(t => post.tech.includes(t))
      return matchTag && matchTech
    })
    
    if (filteredPosts.length > 0) {
      result.push({
        ...series,
        posts: filteredPosts
      })
    }
  })

  // 2. Handle Standalone Posts
  const standalonePosts = postsData['_standalone'] || []
  const filteredStandalone = standalonePosts.filter(post => {
    const matchTag = selectedTags.value.length === 0 || selectedTags.value.some(t => post.tags.includes(t))
    const matchTech = selectedTech.value.length === 0 || selectedTech.value.some(t => post.tech.includes(t))
    return matchTag && matchTech
  })

  if (filteredStandalone.length > 0) {
    result.push({
      title: 'Standalone Posts',
      url: '#',
      isStandalone: true,
      posts: filteredStandalone
    })
  }
  
  return result
})

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) selectedTags.value.splice(index, 1)
  else selectedTags.value.push(tag)
  updateUrl()
}

const toggleTech = (tech: string) => {
  const index = selectedTech.value.indexOf(tech)
  if (index > -1) selectedTech.value.splice(index, 1)
  else selectedTech.value.push(tech)
  updateUrl()
}

const updateUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('tag')
  url.searchParams.delete('tech')
  selectedTags.value.forEach(t => url.searchParams.append('tag', t))
  selectedTech.value.forEach(t => url.searchParams.append('tech', t))
  window.history.replaceState({}, '', url.toString())
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  selectedTags.value = urlParams.getAll('tag')
  selectedTech.value = urlParams.getAll('tech')
})
</script>

<template>
  <div class="all-posts-container">
    <div class="filters-section">
      <div class="filter-group">
        <label>Filter by Tag:</label>
        <div class="filter-options">
          <button 
            v-for="tag in allTags" 
            :key="tag" 
            :class="['filter-btn', { active: selectedTags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            #{{ tag }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label>Filter by Tech:</label>
        <div class="filter-options">
          <button 
            v-for="tech in allTech" 
            :key="tech" 
            :class="['filter-btn', { active: selectedTech.includes(tech) }]"
            @click="toggleTech(tech)"
          >
            <ModelicaLogo v-if="tech.toLowerCase() === 'modelica'" class="btn-icon" />
            <Icon v-else-if="getTechIcon(tech)" :icon="getTechIcon(tech)!" class="btn-icon" />
            {{ tech }}
          </button>
        </div>
      </div>
    </div>

    <div class="results-section">
      <div v-for="series in filteredSeries" :key="series.title" class="series-block">
        <h2 class="series-title">
          <a v-if="!series.isStandalone" :href="series.url">{{ series.title }}</a>
          <span v-else>{{ series.title }}</span>
        </h2>
        <div class="posts-list">
          <div v-for="post in series.posts" :key="post.url" class="post-item-indented">
            <a :href="post.url" class="post-row">
              <div class="post-info-col">
                <span class="post-name">{{ post.title }}</span>
                <div class="post-sub-meta">
                  <div v-if="post.tags.length" class="inline-tags">
                    <span v-for="tag in post.tags" :key="tag" class="mini-tag">#{{ tag }}</span>
                  </div>
                  <div v-if="post.tech.length" class="inline-tech">
                    <template v-for="t in post.tech" :key="t">
                      <ModelicaLogo v-if="t.toLowerCase() === 'modelica'" class="mini-tech" />
                      <Icon v-else-if="getTechIcon(t)" :icon="getTechIcon(t)!" class="mini-tech" />
                    </template>
                  </div>
                </div>
              </div>
              <span class="post-date">{{ formatDate(post.dateWritten) }}</span>
            </a>
          </div>
        </div>
      </div>
      <div v-if="filteredSeries.length === 0" class="no-results">
        No posts match the selected filters.
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-posts-container {
  max-width: 900px;
  margin: 2rem auto;
}

.filters-section {
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.filter-btn.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.btn-icon {
  font-size: 1rem;
}

.series-block {
  margin-bottom: 2.5rem;
}

.series-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border: none;
}

.series-title a, .series-title span {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.series-title a:hover {
  color: var(--vp-c-brand);
}

.posts-list {
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 0.5rem;
  padding-left: 1.5rem;
}

.post-item-indented {
  margin-bottom: 0.75rem;
}

.post-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.post-row:hover {
  background: var(--vp-c-bg-soft);
}

.post-info-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.post-name {
  color: var(--vp-c-brand);
  font-weight: 600;
  font-size: 1.1rem;
}

.post-sub-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.inline-tags {
  display: flex;
  gap: 0.6rem;
}

.mini-tag {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.inline-tech {
  display: flex;
  gap: 0.4rem;
  opacity: 0.8;
}

.mini-tech {
  font-size: 1rem;
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}
</style>
