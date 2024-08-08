import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'

import { redisSubPub } from '~/utils/redis-subpub.util'
import type { Server } from 'socket.io'

export const RedisIoAdapterKey = 'mx-core-socket'

/**
 * 这个适配器的主要作用是让 NestJS 应用能够使用 Redis 作为 Socket.IO 的适配器，从而支持跨多个服务器实例的实时通信。
 * 这在需要水平扩展 WebSocket 服务时特别有用，因为它允许多个服务器实例之间共享连接信息和事件。
 */
export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options) as Server

    // 从本地 Redis 订阅/发布工具
    const { pubClient, subClient } = redisSubPub
    // 使用 createAdapter 创建 Redis 适配器，配置包括：
    // 1. pubClient：发布客户端
    // 2. subClient：订阅客户端
    // 3. key：适配器的键
    // 4. requestsTimeout：请求超时时间
    const redisAdapter = createAdapter(pubClient, subClient, {
      key: RedisIoAdapterKey,
      requestsTimeout: 10000,
    })
    // 将 Redis 适配器设置为服务器的适配器
    server.adapter(redisAdapter)
    return server
  }
}
