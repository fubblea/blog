export interface PageFrontmatter {
  title?: string
  tags?: string[]
  tech?: string[]
  'date-written'?: string
  'last-updated'?: string
  [key: string]: any
}

export const getTechIcon = (t: string): string | null => {
  const mapping: Record<string, string> = {
    python: 'logos:python',
    c: 'logos:c',
    cpp: 'logos:c-plusplus',
    'c++': 'logos:c-plusplus',
    typescript: 'logos:typescript-icon',
    javascript: 'logos:javascript',
    vue: 'logos:vue',
    vitepress: 'logos:vitejs',
    linux: 'logos:linux-tux',
    arduino: 'logos:arduino',
    docker: 'logos:docker-icon',
    git: 'logos:git-icon',
    github: 'logos:github-icon',
    ros: 'simple-icons:ros',
    opencv: 'logos:opencv',
    tensorflow: 'logos:tensorflow',
    pytorch: 'logos:pytorch-icon',
    rust: 'logos:rust',
    raspberrypi: 'logos:raspberry-pi',
  }
  return mapping[t.toLowerCase()] || null
}

export const normalizePath = (p: string) => 
  p.replace(/\.(md|html)$/, '').replace(/\/$/, '')

/**
 * Parses dd-mm-yyyy format into a Date object
 */
export const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // JS months are 0-indexed
  const year = parseInt(parts[2], 10)
  const date = new Date(year, month, day)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Formats a Date object or string into MMM DD, YYYY
 */
export const formatDate = (dateInput: Date | string | null | undefined): string => {
  if (!dateInput) return ''
  let date: Date
  if (dateInput instanceof Date) {
    date = dateInput
  } else {
    const parsed = parseDate(dateInput)
    if (!parsed) return dateInput // Return original string if not parseable
    date = parsed
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
