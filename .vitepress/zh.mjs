import { defineConfig } from 'vitepress'
import common from './common.mjs'

export const zh = defineConfig({
  description: '一个强大的Web思维导图',
  themeConfig: {
    ...common,

    nav: [
      { text: '在线试用', link: 'https://wanglin2.github.io/mind-map/' },
      {
        text: '简介',
        link: '/zh/start/introduction',
        activeMatch: '/zh/start/'
      },
      { text: '部署', link: '/zh/start/deploy' },
      { text: '客户端', link: '/client' },
      { text: '博客', link: '/blog' },
      {
        text: '更多',
        items: [
          { text: '使用帮助', link: '/help/help1', activeMatch: '/help/' },
          { text: '理想文档', link: 'https://github.com/wanglin2/lx-doc' },
          {
            text: '意见反馈',
            link: 'https://github.com/wanglin2/mind-map/issues'
          }
        ]
      }
    ],

    sidebar: {
      '/zh/start/': [
        { text: '简介', link: '/zh/start/introduction' },
        { text: '开始', link: '/zh/start/start' },
        { text: '常见问题', link: '/zh/start/question' },
        { text: '部署', link: '/zh/start/deploy' },
        { text: '贡献', link: '/zh/start/contribute' },
        { text: '更新记录', link: '/zh/start/changelog' }
        // {
        //   text: '收费',
        //   items: [
        //     {
        //       text: 'HandDrawnLikeStyle插件',
        //       link: '/plugins/handDrawnLikeStyle'
        //     },
        //     { text: 'Notation插件', link: '/plugins/notation' },
        //     { text: 'Numbers插件', link: '/plugins/numbers' },
        //     { text: 'Freemind插件', link: '/plugins/freemind' },
        //     { text: 'Excel插件', link: '/plugins/excel' },
        //     { text: 'Checkbox插件', link: '/plugins/checkbox' },
        //     { text: 'Lineflow插件', link: '/plugins/lineflow' },
        //     { text: 'Momentum插件', link: '/plugins/momentum' },
        //     { text: 'RightFishbone插件', link: '/plugins/rightFishbone' },
        //     { text: 'NodeLink插件', link: '/plugins/nodeLink' }
        //   ]
        // }
      ]
      // '/help/': [
      //   { text: '概要/关联线', link: '/help/help1' },
      //   { text: '客户端', link: '/help/help2' },
      //   { text: '打开预览在线文件', link: '/help/help3' },
      //   { text: '复制粘贴', link: '/help/help4' },
      //   { text: '导出', link: '/help/help5' },
      //   { text: '如何编辑数学公式', link: '/help/help6' }
      // ]
    },

    // 自定义 404 页面
    notFound: {
      title: '页面未找到', // 404 页面的主标题
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。', // 页面上的引用语或说明文字
      linkLabel: '前往首页', // 返回首页链接的显示文本
      linkText: '带我回首页' // 链接按钮上的文字（某些主题布局下使用）
    },
    darkModeSwitchLabel: '暗黑模式',
    outlineTitle: '大纲',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})

export const search = {
  placeholder: '搜索文档',
  translations: {
    button: {
      buttonText: '搜索文档',
      buttonAriaLabel: '搜索文档'
    },
    modal: {
      searchBox: {
        resetButtonTitle: '清除查询条件',
        resetButtonAriaLabel: '清除查询条件',
        cancelButtonText: '取消',
        cancelButtonAriaLabel: '取消'
      },
      startScreen: {
        recentSearchesTitle: '搜索历史',
        noRecentSearchesText: '没有搜索历史',
        saveRecentSearchButtonTitle: '保存至搜索历史',
        removeRecentSearchButtonTitle: '从搜索历史中移除',
        favoriteSearchesTitle: '收藏',
        removeFavoriteSearchButtonTitle: '从收藏中移除'
      },
      errorScreen: {
        titleText: '无法获取结果',
        helpText: '你可能需要检查你的网络连接'
      },
      footer: {
        selectText: '选择',
        navigateText: '切换',
        closeText: '关闭',
        searchByText: '搜索提供者'
      },
      noResultsScreen: {
        noResultsText: '无法找到相关结果',
        suggestedQueryText: '你可以尝试查询',
        reportMissingResultsText: '你认为该查询应该有结果？',
        reportMissingResultsLinkText: '点击反馈'
      }
    }
  }
}
