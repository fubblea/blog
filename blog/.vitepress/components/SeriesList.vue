<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { data as postsData } from '../theme/posts.data'
import { getTechIcon, type PageFrontmatter } from '../theme/utils'
import { Icon } from '@iconify/vue'
import ModelicaLogo from './ModelicaLogo.vue'

const { page, frontmatter } = useData<PageFrontmatter>()

const seriesInfo = computed(() => {
  const parts = page.value.relativePath.split('/')
  if (parts.length < 2) return null

  const seriesFolder = parts[0]
  const posts = postsData[seriesFolder] || []
  
  const folderTitle = seriesFolder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return {
    posts,
    title: frontmatter.value.title || folderTitle
  }
})
</script>

<template>
  <div v-if="seriesInfo" class="series-index">
    <header class="title-header">
      <div class="header-content">
        <div class="series-badge">Series Index</div>
        <div class="header-meta">
          <span class="count-badge">{{ seriesInfo.posts.length }} Posts</span>
        </div>
        <p v-if="frontmatter.description" class="series-description">{{ frontmatter.description }}</p>
      </div>
      <div class="header-divider"></div>
    </header>

    <div class="posts-list-container">
      <div class="posts-grid">
        <a v-for="post in seriesInfo.posts" :key="post.url" :href="withBase(post.url)" class="post-card">
          <div class="post-card-header">
            <span class="post-number">{{ post.order.toString().padStart(2, '0') }}</span>
            <h3 class="post-title">{{ post.title }}</h3>
          </div>
          
          <div class="post-card-footer">
            <div v-if="post.tags.length" class="post-tags">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="post-tag">#{{ tag }}</span>
            </div>
            
            <div v-if="post.tech.length" class="post-tech">
              <div v-for="t in post.tech" :key="t" class="tech-icon-wrapper" :title="t">
                <ModelicaLogo v-if="t.toLowerCase() === 'modelica'" />
                <Icon v-else-if="getTechIcon(t)" :icon="getTechIcon(t)!" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.series-description {
  margin-top: 1.5rem;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 700px;
}

/* Post Cards Grid */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 800px;
}

.post-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-card:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-alt);
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.post-card-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.post-number {
  font-family: var(--vp-font-family-mono);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--vp-c-brand);
  opacity: 0.3;
  line-height: 1;
  margin-top: 0.2rem;
}

.post-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.post-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: auto;
}

.post-tags {
  display: flex;
  gap: 0.75rem;
}

.post-tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  opacity: 0.7;
}

.post-tech {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.tech-icon-wrapper {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .post-card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-tech {
    padding-top: 0.5rem;
  }
}
</style>
