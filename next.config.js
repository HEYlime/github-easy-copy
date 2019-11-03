const webpack = require('webpack');
const withCss = require('@zeit/next-css');
const config = require('./oauth-config');
const withLess = require('@zeit/next-less');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');


const configs = {
  // 编译文件的输出目录
  distDir: 'dest',
  // 是否给每个路由生成Etag
  generateEtags: true,
  // 页面内容缓存配置
  onDemandEntries: {
    // 内容在内存中缓存的时长（ms）
    maxInactiveAge: 25 * 1000,
    // 同时缓存多少个页面
    pageBufferLength: 2
  },
  // 在pages 目录下哪种后缀的文件会被认为是页面
  pageExtensions: ['jsx', 'tsx', 'js'],
  // 配置buildID
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }
    return null;
  },
  // 手动修改webpack config
  webpack(config, options) {
    return config;
  },
  // 手动修改webpackDevMiddleware配置
  webpackDevMiddleware(config, options) {
    return config;
  },
  // 可以在页面上通过process.dev.customKey 获取 key
  env: {
    customKey: 'costomeKey value'
  },
  // 通过 next/config 来读取
  // 只有在服务端渲染时才会获取的配置
  serverRuntimeConfig: {
    mySeret: 'secret',
    secondSecret: process.env.SECOND_SECRET,
  },
  // 在服务端和客户端渲染后可以获取的配置
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
}

if (typeof require != 'undefined') {
  require.extensions['.css'] = file => { }
}


const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const SCOPE = 'user';

module.exports = withBundleAnalyzer(withLess(
  withCss({
    webpack(config, options) {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
      return config;
    },
    publicRuntimeConfig: {
      GITHUB_OAUTH_URL,
      OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${SCOPE}`,
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: './../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: './../bundles/client.html'
      }
    }
  })
));