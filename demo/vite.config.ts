import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  resolve: {
    alias: {
      '@confirmkit/core': path.resolve(__dirname, '../packages/core'),
      '@confirmkit/vanilla': path.resolve(__dirname, '../packages/vanilla/src')
    }
  },
  server: {
    port: 3000
  }
}
