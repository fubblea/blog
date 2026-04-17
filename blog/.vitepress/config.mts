import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  head: [
    ['link', { rel: 'icon', href: 'blog/favicon.png' }],
  ],
  title: "Ajay B. Anand",
  description: "Ajay's Blog",
  srcExclude: ['**/README.md'],
  markdown: {
    config: (md) => {
      // Custom ruler to find [@key] or [@key1, @key2]
      md.inline.ruler.after('emphasis', 'cite', (state, silent) => {
        const regex = /^\[@((ref|fig):[^\]]+)\]/
        const match = state.src.slice(state.pos).match(regex)
        if (!match) return false
        if (!silent) {
          const token = state.push('html_inline', '', 0)
          const fullId = match[1]
          if (fullId.startsWith('fig:')) {
            const label = fullId.slice(4) // remove 'fig:'
            token.content = `<FigRef id="${label}"></FigRef>`
          } else if (fullId.startsWith('ref:')) {
            const label = fullId.slice(4) // remove 'ref:'
            token.content = `<Cite id="${label}"></Cite>`
          }
          state.pos += match[0].length
        }
        return true
      })
    }
  },
  transformPageData(pageData) {
    if (pageData.relativePath.endsWith('index.md') && pageData.relativePath !== 'index.md') {
      pageData.frontmatter.outline = false
    }
  },
  vite: {
    resolve: {
      alias: {
        '@retorquere/bibtex-parser': '@retorquere/bibtex-parser/dist/esm/index.js'
      }
    },
    ssr: {
      noExternal: ['@retorquere/bibtex-parser']
    }
  },
  themeConfig: {
    logo: '/favicon.png',
    outline: 'deep',
    sidebar: false,

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'All Posts', link: '/all-posts' },
      { text: 'Series', link: '/series' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fubblea' },
      { icon: 'linkedin', link: "https://www.linkedin.com/in/ajay-b-anand/" }
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            boost: { title: 4, text: 2, titles: 1 },
            fuzzy: 0.2,
            prefix: true
          }
        },
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter) {
            const extraText = [
              ...(env.frontmatter.tags || []),
              ...(env.frontmatter.tech || [])
            ].join(' ')
            return `<p style="display:none">${extraText}</p>\n${html}`
          }
          return html
        }
      }
    }
  }
})
