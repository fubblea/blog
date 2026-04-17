// https://vitepress.dev/guide/custom-theme
import { h, computed } from 'vue'
import { useData, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Frontmatter from '../components/Frontmatter.vue'
import SeriesList from '../components/SeriesList.vue'
import AllPosts from '../components/AllPosts.vue'
import LatestPosts from '../components/LatestPosts.vue'
import SeriesGrid from '../components/SeriesGrid.vue'
import PostNavigation from '../components/PostNavigation.vue'
import Cite from '../components/Cite.vue'
import References from '../components/References.vue'
import { provideCitations } from './useCitations'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: {
    setup() {
      provideCitations()
      const { page } = useData()
      
      const isPost = computed(() => {
        const path = page.value.relativePath
        return path.includes('/') && 
               !path.endsWith('index.md') && 
               !path.includes('all-posts') && 
               !path.includes('series')
      })

      return () => h(DefaultTheme.Layout, null, {
        'doc-after': () => isPost.value ? h('div', [h(References), h(PostNavigation)]) : null
      })
    }
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Frontmatter', Frontmatter)
    app.component('SeriesList', SeriesList)
    app.component('AllPosts', AllPosts)
    app.component('LatestPosts', LatestPosts)
    app.component('SeriesGrid', SeriesGrid)
    app.component('PostNavigation', PostNavigation)
    app.component('Cite', Cite)
    app.component('References', References)
  }
} satisfies Theme
