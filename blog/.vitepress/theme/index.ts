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
import FigRef from '../components/FigRef.vue'
import Figure from '../components/Figure.vue'
import References from '../components/References.vue'
import GitHub from '../components/GitHub.vue'
import { provideCitations } from './useCitations'
import { provideFigures } from './useFigures'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: {
    setup() {
      provideCitations()
      provideFigures()
      const { page } = useData()
      
      const isPost = computed(() => {
        const path = page.value.relativePath
        const isMainPage = path === 'index.md' || 
                          path === 'all-posts.md' || 
                          path === 'series.md' || 
                          path.endsWith('/index.md')
        return !isMainPage
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
    app.component('FigRef', FigRef)
    app.component('Figure', Figure)
    app.component('References', References)
    app.component('GitHub', GitHub)
  }
} satisfies Theme
