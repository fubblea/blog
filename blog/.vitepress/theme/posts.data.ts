import { createContentLoader, type ContentData } from 'vitepress'
import { parseDate } from './utils'

export interface Post {
  title: string
  url: string
  path: string
  order: number
  tags: string[]
  tech: string[]
  dateWritten?: string
  lastUpdated?: string
  dateWrittenTimestamp?: number
  seriesId?: string
}

export default createContentLoader('**/*.md', {
  includeSrc: true,
  transform(raw: ContentData[]): Record<string, Post[]> {
    const seriesMap: Record<string, Post[]> = {}

    raw.forEach((page) => {
      // Skip root index, series indexes, README, and utility pages
      if (
        page.url === '/' || 
        page.url.endsWith('/') || 
        page.url.toLowerCase().includes('readme') ||
        page.url.includes('/all-posts') ||
        page.url.includes('/series')
      ) return

      const parts = page.url.split('/').filter(Boolean)
      const isSeries = parts.length >= 2
      const seriesId = isSeries ? parts[0] : undefined
      const key = seriesId || '_standalone'

      const fileName = parts[parts.length - 1]
      
      // Match "1-title" or "1.title"
      const match = fileName.match(/^(\d+)[-.]/)
      const order = match ? parseInt(match[1], 10) : 999

      if (!seriesMap[key]) {
        seriesMap[key] = []
      }

      const dateWrittenStr = page.frontmatter['date-written']
      const parsedDate = parseDate(dateWrittenStr)

      // Extract title from first H1 if frontmatter title is missing
      let title = page.frontmatter.title
      if (!title && page.src) {
        const h1Match = page.src.match(/^#\s+(.*)$/m)
        if (h1Match) {
          title = h1Match[1].trim()
        }
      }
      
      if (!title) {
        title = fileName.replace(/^(\d+)[-.]/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }

      seriesMap[key].push({
        title,
        url: page.url,
        path: page.url.replace(/\.html$/, ''),
        order,
        tags: page.frontmatter.tags || [],
        tech: page.frontmatter.tech || [],
        dateWritten: dateWrittenStr,
        lastUpdated: page.frontmatter['last-updated'],
        dateWrittenTimestamp: parsedDate ? parsedDate.getTime() : 0,
        seriesId
      })
    })

    // Sort each series by order
    Object.keys(seriesMap).forEach((key) => {
      seriesMap[key].sort((a, b) => a.order - b.order)
    })

    return seriesMap
  }
})

export declare const data: Record<string, Post[]>
