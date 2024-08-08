#!env node
// register global
import cluster from 'node:cluster'

import { DEBUG_MODE } from './app.config'
import { registerForMemoryDump } from './dump'
import { logger } from './global/consola.global'
import { isMainCluster } from './global/env.global'
import { register } from './global/index.global'

// 设置进程标题
// 进程标题是在 node 的进程列表中显示的，可以通过命令行输入命令 node --inspect 来查看
process.title = `Mix Space (${cluster.isPrimary ? 'master' : 'worker'}) - ${
  process.env.NODE_ENV
}`

async function main() {
  register()
  const [{ bootstrap }, { CLUSTER, ENCRYPT }, { Cluster }] = await Promise.all([
    import('./bootstrap'),
    import('./app.config'),
    import('./cluster'),
  ])

  if (!CLUSTER.enable || cluster.isPrimary || isMainCluster) {
    logger.debug(argv)
    logger.log('cwd: ', cwd)
  }

  if (ENCRYPT.enable && ENCRYPT.key) {
    const isValidKey = ENCRYPT.key.length === 64

    if (!isValidKey) {
      logger.error('encrypt key must be 64 length')
      process.exit(1)
    }

    logger.debug('encrypt key: ', ENCRYPT.key)
    logger.warn(
      `Encrypt is enabled, please remember encrypt key. Your key is starts with ${ENCRYPT.key.slice(
        0,
        3,
      )}`,
    )
  }

  DEBUG_MODE.memoryDump && registerForMemoryDump()
  // 如果启用集群，则创建集群
  if (CLUSTER.enable) {
    Cluster.register(
      Number.parseInt(CLUSTER.workers) || os.cpus().length,
      bootstrap,
    )
  } else {
    // 如果不启用集群，则直接启动
    bootstrap()
  }
}

main()
