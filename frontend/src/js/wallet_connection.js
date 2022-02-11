let account_near = null
let wallet_connection = null
let contract = null

const logout_near = () => {
  wallet_connection.signOut()
}

const login_near = () => {
  wallet_connection.requestSignIn(near_config.contractName)
}

const near_config = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  contractName: "haher.testnet",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}
