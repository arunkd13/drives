const Corestore = require('corestore')
const path = require('path')
const Hyperdrive = require('hyperdrive')
const HypercoreId = require('hypercore-id-encoding')
const crayon = require('tiny-crayon')
const errorAndExit = require('../lib/exit.js')
const { findCorestore, noticeStorage } = require('../lib/find-corestore.js')
const fs = require('fs').promises

module.exports = async function cmd (options = {}) {
  if (options.storage && typeof options.storage !== 'string') errorAndExit('--storage <path> is required as string')

  const storage = await findCorestore(options)
  await noticeStorage(storage)

  const store = new Corestore(storage)
  const name = options.useCwd ? path.resolve('.') : process.hrtime.bigint().toString()
  const ns = store.namespace(name)
  const drive = new Hyperdrive(ns)
  await drive.ready()

  const driveId = HypercoreId.encode(drive.key)
  console.log('New drive:', crayon.magenta(HypercoreId.encode(drive.key)))
  await fs.appendFile(storage + '/../drives', driveId + '\n')
}
