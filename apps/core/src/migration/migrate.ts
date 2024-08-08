import { MIGRATE_COLLECTION_NAME } from '~/constants/db.constant'
import { logger } from '~/global/consola.global'
import { getDatabaseConnection } from '~/utils/database.util'

import VersionList from './history'

export async function migrateDatabase() {
  // 连接数据库并获取数据库实例
  const connection = await getDatabaseConnection()
  const db = connection.db

  // 获取已经迁移过的版本
  const migrateArr = await db
    .collection(MIGRATE_COLLECTION_NAME)
    .find()
    .toArray()
  const migrateMap = new Map(migrateArr.map((m) => [m.name, m]))

  for (const migrate of VersionList) {
    // 如果已经迁移过，则跳过
    if (migrateMap.has(migrate.name)) {
      continue
    }

    logger.log(`[Database] migrate ${migrate.name}`)
    try {
      // 如果迁移函数，则直接执行
      if (typeof migrate === 'function') {
        await migrate(db)
      } else {
        // 如果迁移对象，则执行 run 方法
        await migrate.run(db, connection)
      }
    } catch (error) {
      logger.error(`[Database] migrate ${migrate.name} failed`, error)
      throw error
    }

    // 如果迁移成功，在数据库中插入一条记录，将迁移版本信息写入数据库，标记该迁移已完成
    await db.collection(MIGRATE_COLLECTION_NAME).insertOne({
      name: migrate.name,
      time: Date.now(),
    })
  }
}
