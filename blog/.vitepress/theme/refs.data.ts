import { defineLoader } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export interface ReferenceEntry {
  id: string
  type: string
  author?: string
  title?: string
  year?: string
  publisher?: string
  journal?: string
  volume?: string
  number?: string
  pages?: string
  url?: string
  formatted: string
}

export default defineLoader({
  watch: ['../../refs.bib'],
  async load(): Promise<Record<string, ReferenceEntry>> {
    const { parse } = await import('@retorquere/bibtex-parser')
    const bibPath = path.resolve(__dirname, '../../refs.bib')
    const content = fs.readFileSync(bibPath, 'utf-8')
    const bib = parse(content)
    
    const data: Record<string, ReferenceEntry> = {}
    
    for (const entry of bib.entries) {
      const fields: any = {}
      for (const [key, value] of Object.entries(entry.fields)) {
        const lowerKey = key.toLowerCase()
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            // It's a Creator[] (author, editor, etc.)
            // We'll join them back into a string or keep them as is for formatIEEE
            fields[lowerKey] = value
          } else {
            // It's a string[] (publisher, keywords, etc.)
            fields[lowerKey] = value.join(', ').replace(/[\{\}]/g, '')
          }
        } else if (typeof value === 'string') {
          fields[lowerKey] = value.replace(/[\{\}]/g, '')
        } else {
          fields[lowerKey] = value
        }
      }
      
      data[entry.key] = {
        id: entry.key,
        type: entry.type.toLowerCase(),
        ...fields,
        formatted: formatIEEE({ type: entry.type.toLowerCase(), ...fields })
      }
    }
    
    return data
  }
})

/**
 * Basic IEEE-style formatter for books and articles.
 */
function formatIEEE(entry: any) {
  let authors = ''
  
  if (Array.isArray(entry.author)) {
    const authorList = entry.author.map((a: any) => {
      if (a.lastName) {
        const firstInitial = a.firstName ? a.firstName[0] + '. ' : (a.initial ? a.initial + '. ' : '')
        return `${firstInitial}${a.lastName}`
      }
      return a.name || 'Unknown Author'
    })
    
    if (authorList.length > 3) {
      authors = authorList[0] + ' et al.'
    } else if (authorList.length === 2) {
      authors = authorList.join(' and ')
    } else if (authorList.length > 2) {
      authors = authorList.slice(0, -1).join(', ') + ', and ' + authorList.slice(-1)
    } else {
      authors = authorList[0] || 'Unknown Author'
    }
  } else {
    authors = entry.author || 'Unknown Author'
  }

  let title = entry.title || 'Untitled'
  const url = entry.url || entry.doi || ''
  
  if (url) {
    const href = url.startsWith('http') ? url : `https://doi.org/${url}`
    title = `<a href="${href}" target="_blank" rel="noopener noreferrer">${title}</a>`
  }

  const year = entry.year || ''
  const publisher = entry.publisher || ''
  const journal = entry.journal || ''
  const volume = entry.volume ? `vol. ${entry.volume},` : ''
  const number = entry.number ? `no. ${entry.number},` : ''
  const pages = entry.pages ? `pp. ${entry.pages},` : ''

  if (entry.type === 'book') {
    return `${authors}, <i>${title}</i>. ${publisher}${publisher ? ', ' : ''}${year}.`
  } else if (entry.type === 'article' || entry.type === 'inproceedings') {
    const source = journal || entry.booktitle || ''
    return `${authors}, "${title}," <i>${source}</i>, ${volume} ${number} ${pages}${year}.`
  } else {
    return `${authors}, "${title}," ${publisher || journal}${publisher || journal ? ', ' : ''}${year}.`
  }
}

export declare const data: Record<string, ReferenceEntry>
