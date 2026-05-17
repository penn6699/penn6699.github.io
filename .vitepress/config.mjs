import { defineConfig } from 'vitepress'
import { zh, search as searchZh } from './zh.mjs'
import { en } from './en.mjs'
import llms from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [llms()]
  },
  srcDir: 'src',
  base: '/',
  // title: '写码也写心',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
    // [
    //   'script',
    //   {
    //     src: '//sdk.51.la/js-sdk-pro.min.js',
    //     charset: 'UTF-8',
    //     id: 'LA_COLLECT'
    //   }
    // ],
    // [
    //   'script',
    //   {},
    //   `try {
    //     LA.init({
    //       id: 'KRO0WxK8GT66tYCQ',
    //       ck: 'KRO0WxK8GT66tYCQ',
    //       autoTrack: false
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }`
    // ]
  ],
  outDir: './dist',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            ...searchZh
          }
        }
      }
    }
  },
  locales: {
    root: { label: '中文', ...zh },
    // // 屏蔽国际语言切换  中文互换英文
    // en: {
    //   label: 'English',
    //   ...en
    // }
  }
})
