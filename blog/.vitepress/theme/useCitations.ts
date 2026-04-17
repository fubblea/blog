import { ref, watch, provide, inject, type Ref } from 'vue'
import { useData } from 'vitepress'

const CITATIONS_SYMBOL = Symbol('citations')

/**
 * Provides the citation state to the application.
 * Should be called in the setup of the main Layout component.
 */
export function provideCitations() {
  const { page } = useData()
  const citations = ref<string[]>([])
  
  // Reset citations when page changes to ensure per-post bibliography
  watch(() => page.value.relativePath, (newPath) => {
    console.log(`[Citations] Page changed to ${newPath}, resetting citations.`)
    citations.value = []
  }, { immediate: true })
  
  provide(CITATIONS_SYMBOL, citations)
  return citations
}

/**
 * Composable to interact with the citation state.
 */
export function useCitations() {
  const citations = inject<Ref<string[]>>(CITATIONS_SYMBOL)
  
  if (!citations) {
    console.error('[Citations] Critical: CITATIONS_SYMBOL not found in inject!')
  } else {
    console.log('[Citations] useCitations() called, state found.')
  }

  const register = (id: string) => {
    if (!citations) {
      console.warn(`[Citations] Citations state not found for ID: ${id}`)
      return []
    }
    
    // Support multiple IDs separated by commas
    const ids = id.split(',').map(s => s.trim()).filter(Boolean)
    const indices = ids.map(key => {
      const existingIndex = citations.value.indexOf(key)
      if (existingIndex === -1) {
        citations.value.push(key)
        const newIndex = citations.value.length
        console.log(`[Citations] Registered NEW ${key}, index: ${newIndex}`)
        return newIndex
      } else {
        const index = existingIndex + 1
        console.log(`[Citations] Using existing ${key}, index: ${index}`)
        return index
      }
    })
    return indices
  }
  
  return { 
    citations: citations || ref([]), 
    register 
  }
}
