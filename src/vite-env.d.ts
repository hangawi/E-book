declare module '*.vue' {
  import type { DefineComponent} from 'vue'
  const component: DefineCompnent<{}, {}, any>
  export default component
}
