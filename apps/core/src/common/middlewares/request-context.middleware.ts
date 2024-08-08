// https://github.dev/ever-co/ever-gauzy/packages/core/src/core/context/request-context.middleware.ts

import { Injectable } from '@nestjs/common'
import * as cls from 'cls-hooked'
import { RequestContext } from '../contexts/request.context'
import type { NestMiddleware } from '@nestjs/common'
import type { IncomingMessage, ServerResponse } from 'node:http'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  // 使用 cls-hooked 库来管理请求上下文
  use(req: IncomingMessage, res: ServerResponse, next: () => any) {
    // 创建一个 RequestContext 实例
    const requestContext = new RequestContext(req, res)

    // 获取或创建一个 RequestContext 命名空间
    const session =
      cls.getNamespace(RequestContext.name) ||
      cls.createNamespace(RequestContext.name)

    // 将 RequestContext 实例设置到 RequestContext 命名空间中
    session.run(async () => {
      session.set(RequestContext.name, requestContext)
      next()
    })
  }
}

/**
 * 这个文件定义了一个名为 RequestContextMiddleware 的中间件，它的主要作用是为每个 HTTP 请求创建和管理一个请求上下文。以下是该中间件的主要功能：
 * 为每个请求创建一个 RequestContext 实例，该实例包含了请求和响应对象的信息。
 * 使用 cls-hooked 库来创建或获取一个命名空间，这个命名空间用于存储请求上下文。
 * 将创建的 RequestContext 实例存储在这个命名空间中，使得在整个请求处理过程中，其他部分的代码可以访问到这个上下文信息。
 * 确保在请求处理完成后，上下文信息会被正确清理。
 * 这个中间件的主要目的是实现请求级别的数据隔离和共享。通过使用 cls-hooked，它可以在不同的异步操作之间传递请求相关的信息，而不需要显式地传递参数。这对于实现一些跨多个函数或模块的功能非常有用，比如日志记录、用户认证状态维护等。
 * 在 NestJS 应用中，你可以将这个中间件应用到全局或特定的路由中，以确保每个请求都有自己的上下文。
 */
