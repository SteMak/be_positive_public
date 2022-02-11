import { connect, Contract, keyStores, WalletConnection } from "near-api-js"

const init_contract_near = async () => {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, near_config))

  wallet_connection = new WalletConnection(near)
  document.dispatchEvent(new Event("inited_wallet_connection"))

  account_near = wallet_connection.getAccountId()
  document.dispatchEvent(new Event("change_account_near"))

  contract = await new Contract(wallet_connection.account(), near_config.contractName, {
    changeMethods: ["nft_create", "nft_update_price", "nft_buy", "nft_burn"],
  })

  connected_near = true
  document.dispatchEvent(new Event("connect_near"))
}

init_contract_near()
