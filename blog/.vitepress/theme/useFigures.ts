import { ref, watch, provide, inject, type Ref } from 'vue'
import { useData } from 'vitepress'

const FIGURES_SYMBOL = Symbol('figures')

/**
 * Provides the figure numbering state to the application.
 * Should be called in the setup of the main Layout component.
 */
export function provideFigures() {
  const { page } = useData()
  const figures = ref<string[]>([])
  
  // Reset figures when page changes (navigation) or content is hot-reloaded (HMR)
  watch(() => page.value.relativePath, (newPath) => {
    console.log(`[Figures] Page change detected to ${newPath}, resetting figures.`)
    figures.value = []
  }, { immediate: true })
  
  provide(FIGURES_SYMBOL, figures)
  return figures
}

/**
 * Composable to interact with the figure numbering state.
 */
export function useFigures() {
  const figures = inject<Ref<string[]>>(FIGURES_SYMBOL)
  
  if (!figures) {
    console.error('[Figures] Critical: FIGURES_SYMBOL not found in inject!')
  } else {
    // console.log('[Figures] useFigures() called, state found.')
  }

  const register = (id: string | null) => {
    if (!figures) return -1
    
    if (id && figures.value.includes(id)) {
      const index = figures.value.indexOf(id) + 1
      // console.log(`[Figures] Using existing ${id}, index: ${index}`)
      return index
    }

    if (!id) {
      // If no ID is provided, we can't easily make it idempotent without more info
      // But we can at least log it
      const fallbackId = `__unlabeled_${figures.value.length}`
      figures.value.push(fallbackId)
      const index = figures.value.length
      console.log(`[Figures] Registered NEW unlabeled figure, index: ${index}`)
      return index
    }
    
    figures.value.push(id)
    const index = figures.value.length
    console.log(`[Figures] Registered NEW ${id}, index: ${index}`)
    return index
  }

  const getNumber = (id: string) => {
    if (!figures) return -1
    const index = figures.value.indexOf(id)
    return index !== -1 ? index + 1 : -1
  }

  const reset = () => {
    if (figures) {
      figures.value = []
    }
  }
  
  return { 
    figures: figures || ref([]), 
    register, 
    getNumber,
    reset
  }
}
