import { defineConfig } from 'vitepress'
import common from './common.mjs'

export const en = defineConfig({
  description: 'A powerful web mind map',
  title: 'Write code and write heart',
  themeConfig: {
    ...common,
    
    nav: [
      { text: 'Online trial', link: 'https://wanglin2.github.io/mind-map/' },
      { text: 'Online docs', link: 'https://wanglin2.github.io/mind-map-docs/' },
      // {
      //   text: 'Start',
      //   link: '/en/start/introduction',
      //   activeMatch: '/en/start/'
      // },
      // { text: 'Sponsor', link: '/sponsor' },
      // { text: 'Client', link: '/en/client' },
      // { text: 'Blog', link: '/en/blog' },
      // {
      //   text: 'More',
      //   items: [
      //     { text: 'Help', link: '/help/help1', activeMatch: '/help/' },
      //     {
      //       text: 'Ideal Document',
      //       link: 'https://github.com/wanglin2/lx-doc'
      //     },
      //     {
      //       text: 'Issues',
      //       link: 'https://github.com/wanglin2/mind-map/issues'
      //     }
      //   ]
      // }
    ],

    sidebar: {
      '/en/start/': [
        { text: 'Introduction', link: '/en/start/introduction' },
        { text: 'Start', link: '/en/start/start' },
        { text: 'Question', link: '/en/start/question' },
        { text: 'Deploy', link: '/en/start/deploy' },
        { text: 'Contribute', link: '/en/start/contribute' },
        { text: 'Changelog', link: '/en/start/changelog' }
      ]
    },

    darkModeSwitchLabel: 'Dark mode',
    outlineTitle: 'Outline',
    docFooter: {
      prev: 'Prev',
      next: 'Next'
    }
  }
})
