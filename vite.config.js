import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'

//mock
import { viteMockServe } from 'vite-plugin-mock'
//inject title
import { createHtmlPlugin } from 'vite-plugin-html'
//setup name
// import VueSetupExtend from 'vite-plugin-vue-setup-extend-plus'

// auto import element-plus has some issue
import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//auto import vue https://www.npmjs.com/package/unplugin-auto-import
import AutoImport from 'unplugin-auto-import/vite'

import UnoCSS from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'

import mkcert from 'vite-plugin-mkcert'
import DefineOptions from 'unplugin-vue-define-options/vite'

//  import image
//  Use directly <img :src="Logo" />
// import ViteImages from 'vite-plugin-vue-images'
import setting from './src/settings'
// import { loadEnv } from 'vite'
const prodMock = setting.openProdMock
// import packageJson from './package.json'

/* use child_process to exec shell */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const child_process = require('child_process')
let commitHash = ''
try {
  commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {
  console.log('The git repository is empty or git is not installed')
}

import { optimizeDepsArr } from './optimize-include'
const pathSrc = path.resolve(__dirname, 'src')
export default ({ command, mode }) => {
  /*
   console.log(command, mode)
  * serve serve-dev
  * */
  return {
    //detail to look https://vitejs.cn/config/#base
    base: setting.viteBasePath,
    // publicDir: 'test',
    //define global var
    define: {
      //fix "path" module issue
      'process.platform': null,
      'process.version': null,
      //define global var
      GLOBAL_VAR: {
        GIT_COMMIT_ID: commitHash
      }
    },
    clearScreen: false,
    server: {
      hmr: { overlay: false }, // disable or configure HMR connect set up server.hmr.overlay for false Server error mask layer can be disabled
      // Service configuration
      port: 5006, // 
      open: true, // type： boolean | string Automatically open the application in the browser when the server starts;
      cors: true, // type： boolean | CorsOptions Configure CORS for the development server. Enabled by default and allows any origin
      host: true,
      https: false //whether open https Opening https for the first time is slow and there is a password input process
      //proxy look for https://vitejs.cn/config/#server-proxy
      // proxy: {
      //   '/api': {
      //     target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    preview: {
      port: 5007,
      host: true,
      strictPort: true
    },
    plugins: [
      vue({ reactivityTransform: true }),
      Components({
        // resolvers: [
        //   ElementPlusResolver({
        //     importStyle: 'sass'
        //   })
        // ]
      }),
      UnoCSS({
        presets: [presetUno(), presetAttributify(), presetIcons()]
      }),
      DefineOptions(),
      mkcert(),
      //compatible with old browsers
      // legacy({
      //   targets: ['chrome 52'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      // }),
      vueJsx(),
      viteSvgIcons({
        // config svg dir that can config multi
        iconDirs: [path.resolve(process.cwd(), 'src/icons/common'), path.resolve(process.cwd(), 'src/icons/nav-bar')],
        // appoint svg icon using mode
        symbolId: 'icon-[dir]-[name]'
      }),
      //https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md
      viteMockServe({
        supportTs: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true
      }),
      // VueSetupExtend(), instance of  DefineOptions
      //https://github.com/antfu/unplugin-auto-import/blob/HEAD/src/types.ts
      AutoImport({
        // resolvers: [ElementPlusResolver()],
        imports: [
          'vue',
          'pinia',
          'vue-router',
          {
            '@/hooks/global/useCommon': ['useCommon'],
            '@/hooks/global/useElement': ['useElement'],
            '@/hooks/global/useVueRouter': ['useVueRouter'],
            '@/utils/axiosReq': ['axiosReq']
          }
        ],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: true //auto generation auto-imports.d.ts file
      }),
      // auto config of index.html title
      createHtmlPlugin({
        inject: {
          // Inject data into ejs template
          data: {
            title: setting.title
          }
        }
      })
    ],
    build: {
      minify: 'terser',
      brotliSize: false,
      // Eliminate pack size over warning
      chunkSizeWarningLimit: 5000,
      //remote console.log in prod
      terserOptions: {
        //detail to look https://terser.org/docs/api-reference#compress-options
        compress: {
          drop_console: false,
          pure_funcs: ['console.log', 'console.info'],
          drop_debugger: true
        }
      },
      //build assets Separate
      assetsDir: 'static/assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '~/': `${pathSrc}/`,
        '@/': `${pathSrc}/`,
        //remove i18n waring
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
      //why remove it , look for https://github.com/vitejs/vite/issues/6026
      // extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    css: {
      // postcss: {
      //   //remove build charset warning
      //   plugins: [
      //     {
      //       postcssPlugin: 'internal:charset-removal',
      //       AtRule: {
      //         charset: (atRule) => {
      //           if (atRule.name === 'charset') {
      //             atRule.remove()
      //           }
      //         }
      //       }
      //     }
      //   ]
      // },
      preprocessorOptions: {
        //define global scss variable
        // scss: {
        //   additionalData: `@use '@/theme/index.scss' as * ;`
        // }
      }
    },
    optimizeDeps: {
      //include: [...optimizeDependencies,...optimizeElementPlus] //on-demand element-plus use this
      // include: [...optimizeDependencies] //on-demand dependencies in package.json
      include: ['moment-mini']
    }
  }
}
