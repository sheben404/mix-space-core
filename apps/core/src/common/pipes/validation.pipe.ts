import { Injectable, ValidationPipe } from '@nestjs/common'

import { isDev } from '~/global/env.global'
import type { ValidationPipeOptions } from '@nestjs/common'

// `ExtendedValidationPipe` 类被定义为可注入的（使用 `@Injectable()` 装饰器）
@Injectable()
export class ExtendedValidationPipe extends ValidationPipe {
  public static readonly options: ValidationPipeOptions = {
    // 启用输入数据的自动转换
    transform: true,
    // 只允许白名单中的属性
    whitelist: true,
    // 如果验证失败，则返回 422 Unprocessable Entity 状态码
    errorHttpStatusCode: 422,
    // 如果输入数据中包含未知属性，则抛出错误
    forbidUnknownValues: true,
    // 在开发环境中启用调试消息
    enableDebugMessages: isDev,
    // 遇到第一个错误时停止验证
    stopAtFirstError: true,
  }

  // 定义静态只读属性 shared，它是 ExtendedValidationPipe 的一个实例，使用上面定义的 options 进行初始化
  public static readonly shared = new ExtendedValidationPipe(
    ExtendedValidationPipe.options,
  )
}

// 这个扩展的验证管道可以在整个应用中共享使用，提供了一致的数据验证和转换行为。通过使用 ExtendedValidationPipe.shared，可以在需要验证的地方轻松应用这些预定义的验证规则。
