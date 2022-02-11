const actualize_history = () => {
  const params_search = new URLSearchParams(location.search)
  let hist
  const sthash = location.hash
  const sthf = sthash.slice(0, 5)
  const sthl = sthash.slice(-46)
  const sth = sthf + sthl
  if (sthf == "" || sthf == "#pop" || sthf == "#chp" || sthf == "#new") {
    hist = 0
  } else if (sthf == "#tok_") {
    hist = 0
    if (params_search.has("account_id")) {
      const finish_sign = () => {
        wallet_connection._completeSignInWithAccessKey().then(() => {
          hist = 1
          history.replaceState({}, "", "#pop")
          history.pushState({}, "", sthf + "buy_" + sthl)
          window.dispatchEvent(new Event("hashchange"))
        })
      }
      wallet_connection == null ? document.addEventListener("inited_wallet_connection", finish_sign, { once: true }) : finish_sign()
    } else {
      hist = 1
      history.replaceState({}, "", "#pop")
      history.pushState({}, "", sth)
    }
  } else if (sthf == "#buy_") {
    hist = 1
    if (params_search.has("transactionHashes") || params_search.has("errorCode")) {
      let sthfn = sthf
      if (params_search.has("transactionHashes")) {
        sthfn += "scs_"
      } else if (params_search.has("errorCode")) {
        sthfn += "err_"
      }
      hist = 2
      const currentUrl = new URL(location.href)
      currentUrl.searchParams.delete("transactionHashes")
      currentUrl.searchParams.delete("errorCode")
      currentUrl.searchParams.delete("errorMessage")
      history.replaceState({}, "", currentUrl)
      history.replaceState({}, "", "#pop")
      history.pushState({}, "", "#tok_" + sthl)
      history.pushState({}, "", sthfn + sthl)
    } else {
      hist = 2
      history.replaceState({}, "", "#pop")
      history.pushState({}, "", "#tok_" + sthl)
      history.pushState({}, "", sth)
    }
  } else if (sthf == "#roc_" || sthf == "#rvs_") {
    hist = 2
    history.replaceState({}, "", "?#pop")
    history.pushState({}, "", "?#tok_" + sthl)
    history.pushState({}, "", "?" + sth)
  }
  return hist
}
const acc_actualize_history = () => {
  const params_search = new URLSearchParams(location.search)
  let hist
  const sthash = location.hash
  const sths = sthash.slice(0, 9)
  const sthsf = sths.slice(1, 4)
  const sthss = sths.slice(5, 8)

  const sthf = sthash.slice(0, 5)
  const sthl = sthash.slice(-46)
  const sth = sths + sthl
  if (sths == "" || ((sthsf == "own" || sthsf == "lok" || sthsf == "crt") && (sthss == "new" || sthss == "chp" || sthss == "rch"))) {
    hist = 0
  } else if (sthf == "#tok_") {
    hist = 1
    history.replaceState({}, "", "#own_new")
    history.pushState({}, "", sth)
  } else if (sthf == "#buy_") {
    hist = 1
    if (params_search.has("transactionHashes") || params_search.has("errorCode")) {
      let sthfn = sthf
      if (params_search.has("transactionHashes")) {
        sthfn += "scs_"
      } else if (params_search.has("errorCode")) {
        sthfn += "err_"
      }
      hist = 2
      const currentUrl = new URL(location.href)
      currentUrl.searchParams.delete("transactionHashes")
      currentUrl.searchParams.delete("errorCode")
      currentUrl.searchParams.delete("errorMessage")
      history.replaceState({}, "", currentUrl)
      history.replaceState({}, "", "#own_new")
      history.pushState({}, "", "#tok_crt_" + sthl)
      history.pushState({}, "", sthfn + sthl)
    } else {
      hist = 2
      history.replaceState({}, "", "#own_new")
      history.pushState({}, "", "#tok_crt_" + sthl)
      history.pushState({}, "", sth)
    }
  } else if (sthf == "#upd_") {
    hist = 1
    if (params_search.has("transactionHashes") || params_search.has("errorCode")) {
      let sthfn = sthf
      if (params_search.has("transactionHashes")) {
        sthfn += "scs_"
      } else if (params_search.has("errorCode")) {
        sthfn += "err_"
      }
      hist = 2
      const currentUrl = new URL(location.href)
      currentUrl.searchParams.delete("transactionHashes")
      currentUrl.searchParams.delete("errorCode")
      currentUrl.searchParams.delete("errorMessage")
      history.replaceState({}, "", currentUrl)
      history.replaceState({}, "", "#own_new")
      history.pushState({}, "", "#tok_own_" + sthl)
      history.pushState({}, "", sthfn + sthl)
    } else {
      hist = 2
      history.replaceState({}, "", "#own_new")
      history.pushState({}, "", "#tok_own_" + sthl)
      history.pushState({}, "", sth)
    }
  }
  return hist
}
const new_actualize_history = () => {
  let sth = location.hash
  const sthf = sth.slice(0, 5)
  if (sthf == "#scs_") {
    sth = sth.slice(5)
  } else if (sthf == "#err_") {
    sth = sth.slice(5)
  } else {
    sth = sth.slice(1)
  }

  const params_search = new URLSearchParams(location.search)
  if (params_search.has("transactionHashes") || params_search.has("errorCode")) {
    if (params_search.has("transactionHashes")) {
      sth = "#scs_" + sth
    } else if (params_search.has("errorCode")) {
      sth = "#err_" + sth
    } else {
      sth = "#" + sth
    }
    const currentUrl = new URL(location.href)
    currentUrl.searchParams.delete("transactionHashes")
    currentUrl.searchParams.delete("errorCode")
    currentUrl.searchParams.delete("errorMessage")
    history.replaceState({}, "", currentUrl)
    history.pushState({}, "", sth)
  } else {
    history.pushState({}, "", "#" + sth)
  }

  return 0
}

const go_ford = hash => {
  hist += 2
  location.hash = hash
}
const go_back = hash => {
  if (hist == 0) {
    go_ford(hash)
  } else {
    history.go(-1)
  }
}

const actualize_history_event_hash = () => hist--

const init_actualize_history_events = () => {
  window.addEventListener("hashchange", actualize_history_event_hash)
}
const dest_actualize_history_events = () => {
  window.removeEventListener("hashchange", actualize_history_event_hash)
}

const init_actualize_history = path => {
  if (location.hash.includes("?")) {
    console.log(location.hash)
    const wrong_hash = location.hash.split("?")
    location.hash = wrong_hash[0]
    location.search = "?" + wrong_hash[1]
  }
  if (path == "/") {
    if (location.hash == "") history.replaceState({}, "", "#pop")
    hist = actualize_history()
  } else if (path == "/account") {
    if (location.hash == "") history.replaceState({}, "", "#own_new")
    hist = acc_actualize_history()
  } else if (path == "/new") {
    hist = new_actualize_history()
  }
  init_actualize_history_events()
}
const dest_actualize_history = () => {
  hist = null
  dest_actualize_history_events()
}
