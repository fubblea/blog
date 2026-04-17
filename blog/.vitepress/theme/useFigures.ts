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
  watch(page, () => {
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
  }

  const register = (id: string | null) => {
    if (!figures) return -1
    
    if (id && figures.value.includes(id)) {
      return figures.value.indexOf(id) + 1
    }

    const actualId = id || `__unlabeled_${figures.value.length}`
    if (figures.value.includes(actualId)) {
      return figures.value.indexOf(actualId) + 1
    }
    
    figures.value.push(actualId)
    return figures.value.length
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
