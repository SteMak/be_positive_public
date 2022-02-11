import { keyStores } from "near-api-js"

const asciiToUint8Array = str => {
  var chars = []
  for (var i = 0; i < str.length; ++i) {
    chars.push(str.charCodeAt(i))
  }
  return new Uint8Array(chars)
}

window.sign_data = async data => {
  const key_store = new keyStores.BrowserLocalStorageKeyStore()
  const message = asciiToUint8Array(data)
  const pack = {
    message: Array.from(message),
  }
  const key_pair = await key_store.getKey("testnet", account_near)
  const signed = key_pair.sign(message)
  pack.key_type = signed.publicKey.toString().split(":")[0].toLowerCase()
  pack.public_key = Array.from(signed.publicKey.data)
  pack.signature = Array.from(signed.signature)
  return pack
}
