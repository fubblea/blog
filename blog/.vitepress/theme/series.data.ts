import { createContentLoader, type ContentData } from 'vitepress'

export interface Series {
  title: string
  url: string
  description?: string
}

export default createContentLoader('**/index.md', {
  includeSrc: true,
  transform(raw: ContentData[]): Series[] {
    return raw
      .filter(page => page.url !== '/') // Exclude the root index.md
      .map(page => {
        let title = page.frontmatter.title
        if (!title && page.src) {
          const h1Match = page.src.match(/^#\s+(.*)$/m)
          if (h1Match) {
            title = h1Match[1].trim()
          }
        }

        if (!title) {
          title = page.url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Untitled Series'
        }

        return {
          title,
          url: page.url,
          description: page.frontmatter.description
        }
      })
  }
})

export declare const data: Series[]
