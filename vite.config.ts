import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import htmlConfig from 'vite-plugin-html-config'
import { viteExternalsPlugin } from 'vite-plugin-externals/dist/src'

// https://vitejs.dev/config/
export default ({ mode: VITE_MODE }: { mode: string }) => {
  const env = loadEnv(VITE_MODE, process.cwd())
  console.log('VITE_MODE: ', VITE_MODE)
  console.log('ENV: ', env)

  const plugins = [vue({
    template:{
      compilerOptions:{
        isCustomElement: tag => tag.startsWith('fc-')
      }
    }
  })]

  const externalConfig = viteExternalsPlugin({
    cesium: 'Cesium'
  })
  const htmlConfigs = htmlConfig({
    headScripts: [
      {
        src: './lib/cesium/Cesium.js'
      }
    ],
    links: [
      {
        // ******* Always use external CesiumJS's style util official package output. *******
        // ******* 直到官方 CesiumJS 包导出样式文件前，都使用外部样式 *******
        rel: 'stylesheet',
        href: './lib/cesium/Widgets/widgets.css'
      }
    ]
  })
  plugins.push(
    externalConfig,
    htmlConfigs
  )

  return defineConfig({
    root: './',
    base:'/cesiumdemo/',
    assetsInclude:['**/*.gltf'],
    build: {
      assetsDir: './',
      minify: ['false'].includes(env.VITE_IS_MINIFY) ? false : true
    },
    plugins: plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    optimizeDeps: {
      include: ['vue', '@vueuse/core'],
      exclude: ['vue-demi', '@vite/client', '@vite/env']
    },
  })
}
