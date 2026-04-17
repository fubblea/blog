/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*/series.data' {
  import { Series } from './series.data.ts'
  export const data: Series[]
}

declare module '*/posts.data' {
  import { Post } from './posts.data.ts'
  export const data: Record<string, Post[]>
}
