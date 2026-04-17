<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as postsData } from '../theme/posts.data'
import { data as seriesData } from '../theme/series.data'
import { formatDate, getTechIcon } from '../theme/utils'
import { Icon } from '@iconify/vue'
import TechIcon from './TechIcon.vue'

const latestPosts = computed(() => {
  return Object.values(postsData)
    .flat()
    .sort((a, b) => (b.dateWrittenTimestamp || 0) - (a.dateWrittenTimestamp || 0))
    .slice(0, 5)
})

const getSeriesTitle = (seriesId: string | undefined) => {
  if (!seriesId) return null
  const series = seriesData.find(s => s.url.includes(`/${seriesId}/`))
  return series ? series.title : null
}
</script>

<template>
  <div class="latest-posts">
    <h2 class="section-title">Latest Posts</h2>
    <div class="posts-list">
      <a v-for="post in latestPosts" :key="post.url" :href="withBase(post.url)" class="post-card-full">
        <div class="card-left">
          <div class="post-meta-top">
            <span v-if="post.seriesId" class="series-tag">{{ getSeriesTitle(post.seriesId) }}</span>
            <span class="post-date-tag">{{ formatDate(post.dateWritten) }}</span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <div v-if="post.tags.length" class="post-tags-row">
            <span v-for="tag in post.tags" :key="tag" class="post-tag-item">#{{ tag }}</span>
          </div>
        </div>
        
        <div class="card-right">
          <div v-if="post.tech.length" class="tech-stack-row">
            <div v-for="t in post.tech" :key="t" class="tech-icon-circle" :title="t">
              <TechIcon :tech="t">
                <template #fallback><span></span></template>
              </TechIcon>
            </div>
          </div>
          <div class="post-arrow-btn">
            <Icon icon="lucide:arrow-right" />
          </div>
        </div>
      </a>
    </div>
    
    <div class="view-all-container">
      <a :href="withBase('/all-posts')" class="view-all-btn">
        <span>View All Posts</span>
        <Icon icon="lucide:arrow-right" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.latest-posts {
  margin: 4rem 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
  border: none;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.post-card-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-card-full:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-alt);
  transform: scale(1.01);
  box-shadow: var(--vp-shadow-3);
}

.post-meta-top {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.series-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-date-tag {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.post-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.post-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.post-tag-item {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  opacity: 0.7;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.tech-stack-row {
  display: flex;
  gap: 0.75rem;
}

.tech-icon-circle {
  font-size: 1.4rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s ease;
}

.post-card-full:hover .tech-icon-circle {
  border-color: var(--vp-c-brand-soft);
}

.post-arrow-btn {
  font-size: 1.5rem;
  color: var(--vp-c-brand);
  opacity: 0.3;
  transition: all 0.2s ease;
}

.post-card-full:hover .post-arrow-btn {
  opacity: 1;
  transform: translateX(5px);
}

.view-all-container {
  display: flex;
  justify-content: center;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 2rem;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: var(--vp-shadow-2);
}

.view-all-btn:hover {
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
  border-color: var(--vp-button-brand-hover-border);
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-3);
}

.view-all-btn .icon {
  transition: transform 0.3s ease;
}

.view-all-btn:hover .icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .post-card-full {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  
  .card-right {
    width: 100%;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--vp-c-divider);
    justify-content: space-between;
  }
}
</style>
