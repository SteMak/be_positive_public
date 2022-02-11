const homedir = require("os").homedir()
const path = require("path")
const nearAPI = require("near-api-js")
const { connect, keyStores, transactions } = nearAPI

const CREDENTIALS_DIR = process.env.NEAR_CREDENTIALS_DIR || ".near-credentials"
const CONTRACT_NAME = process.env.CONTRACT_NAME
const credentialsPath = path.join(homedir, CREDENTIALS_DIR)
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath)
const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

async function keysGroupBySize(near, account_id, minSizeOfByte = 10000) {
  const response = await near.connection.provider.query({
    request_type: "view_state",
    finality: "final",
    account_id,
    prefix_base64: "",
  })
  let cursor = 0
  return response.values.reduce((acc, it) => {
    if (acc[cursor] && acc[cursor].size >= minSizeOfByte) {
      cursor += 1
    }
    if (!acc[cursor]) {
      acc.push({ size: 0, keys: [] })
    }
    acc[cursor].size += it.key.length + it.value.length
    acc[cursor].keys.push(it.key)
    return acc
  }, [])
}

async function clean(near, account_id, groupKeys) {
  const account = await near.account(account_id)
  const actions = groupKeys.map(it => transactions.functionCall("clean", Buffer.from(JSON.stringify({ keys: it.keys })), 30_000000000000, "0"))
  return account.signAndSendTransaction({ receiverId: account_id, actions })
}

async function main() {
  const near = await connect(config)
  const groupKeys = await keysGroupBySize(near, CONTRACT_NAME)
  const out = await clean(near, CONTRACT_NAME, groupKeys)
  console.log(`${config.explorerUrl}/transactions/${out.transaction_outcome.id}`)
}

main().catch(reason => {
  console.error(reason)
})
