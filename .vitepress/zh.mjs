import { defineConfig } from 'vitepress'
import common from './common.mjs'

export const zh = defineConfig({
  description: '一个强大的Web思维导图',

  title: '写码也写心',
  themeConfig: {
    ...common,

    nav: [
      // { text: '在线试用', link: 'https://wanglin2.github.io/mind-map/' },
      // { text: '在线文档', link: 'https://wanglin2.github.io/mind-map-docs/' },
      {
        text: '作品集',
        link: '/zh/sample_reels/short-link',
        activeMatch: '/zh/sample_reels/'
      },
      {
        text: '软件',
        link: '/zh/software/frp',
        activeMatch: '/zh/software/'
      },
      {
        text: '开发',
        items: [
          { text: 'Docker', link: '/zh/docker/docker' },
          { text: 'Python', link: '/zh/python/python' },
          { text: 'Django', link: '/zh/django/django' },
          { text: '前端', link: '/zh/frontend/frontend' }
        ]
      },
      {
        text: '开源项目',
        items: [
          { text: '网络开源项目', link: '/zh/open_source/network/network' }
          // , { text: '我的开发项目', link: '/zh/open_source/mine/mine' }
        ]
      }

      // {
      //   text: '简介',
      //   link: '/zh/start/introduction',
      //   activeMatch: '/zh/start/'
      // },
      // { text: '客户端', link: '/client' },
      // {
      //   text: '更多',
      //   items: [
      //     { text: '使用帮助', link: '/help/help1', activeMatch: '/help/' },
      //     { text: '理想文档', link: 'https://github.com/wanglin2/lx-doc' },
      //     {
      //       text: '意见反馈',
      //       link: 'https://github.com/wanglin2/mind-map/issues'
      //     }
      //   ]
      // }
    ],

    sidebar: {
      '/zh/sample_reels/': [
        { text: '短链接管理软件', link: '/zh/sample_reels/short-link' }
      ],
      '/zh/software/': [
        {
          text: '内网穿透软件',
          items: [
            { text: 'FRP', link: '/zh/software/frp' },
          ]
        },
        {
          text: 'Linux',
          items: [
            { text: 'Tmux', link: '/zh/software/i_0001_tmux' },
          ]
        },
      ],
      '/zh/docker/': [
        { text: 'Docker', link: '/zh/docker/docker' },
        { text: 'Docker操作命令', link: '/zh/docker/i_0001_command' },
        { text: 'Docker操作命令-网络命令', link: '/zh/docker/i_0002_command_network' },
        { text: 'Docker安装(Alibaba Cloud Linux 4)', link: '/zh/docker/i_000_3_docker_install' },
      ],
      '/zh/python/': [
        { text: 'Python', link: '/zh/python/python' },
        { text: 'Python虚拟环境', link: '/zh/python/i_0001_venv' },
        { text: 'Python版本管理pyenv工具', link: '/zh/python/i_0002_pyenv' },
        { text: 'Python版本管理与虚拟环境uv工具', link: '/zh/python/i_0003_uv' },
      ],
      '/zh/django/': [{ text: 'Django', link: '/zh/django/django' }],
      '/zh/frontend/': [
        { text: '前端', link: '/zh/frontend/frontend' },
        {
          text: 'JavaScript',
          items: [{ text: 'JS', link: '/zh/frontend/i_0001_javascript' }]
        }
      ],
      '/zh/open_source/mine/': [
        { text: '我的开发项目', link: '/zh/open_source/mine/mine' }
      ],
      '/zh/open_source/network/': [
        { text: '网络开源项目', link: '/zh/open_source/network/network' }
      ],

      '/zh/start/': [
        { text: '简介', link: '/zh/start/introduction' },
        { text: '开始', link: '/zh/start/start' },
        { text: '常见问题', link: '/zh/start/question' },
        { text: '部署', link: '/zh/start/deploy' },
        { text: '贡献', link: '/zh/start/contribute' },
        { text: '更新记录', link: '/zh/start/changelog' }

        //   text: '收费',
        //   items: [
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
