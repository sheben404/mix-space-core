import fs from 'node:fs'
import v8 from 'node:v8'
import { TEMP_DIR } from './constants/path.constant'

// 设置内存堆快照的创建机制。
export function registerForMemoryDump() {
  function createHeapSnapshot() {
    // 使用 v8.getHeapSnapshot() 创建堆快照
    const snapshotStream = v8.getHeapSnapshot()
    // 获取当前时间
    const localeDate = new Date().toLocaleString()
    // 拼接文件名
    const fileName = `${TEMP_DIR}/HeapSnapshot-${localeDate}.heapsnapshot`
    // 创建一个写入流，将快照数据写入文件
    const fileStream = fs.createWriteStream(fileName)
    // 将快照数据写入文件
    snapshotStream.pipe(fileStream).on('finish', () => {
      console.log('Heap snapshot saved to', fileName)
    })
  }

  // 监听 SIGUSR2 信号（通常用于用户自定义的进程控制），当接收到 SIGUSR2 信号时，触发堆快照的创建
  // 这个功能允许开发者在需要时（通过发送 SIGUSR2 信号）创建内存堆快照，这对于调试内存问题和性能分析非常有用。
  // 快照文件将保存在指定的临时目录中，文件名包含创建时间，便于识别和管理。
  // 什么是 SIGUSR2 信号？
  // SIGUSR2 是 Unix/Linux 系统中用于用户自定义的进程控制的信号。这个信号通常用于在运行时创建内存堆快照，以便进行内存泄漏的分析。
  process.on('SIGUSR2', () => {
    console.log('SIGUSR2 received, creating heap snapshot...')
    createHeapSnapshot()
  })
}
