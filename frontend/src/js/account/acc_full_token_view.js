let acc_opened_id = ""

const acc_close_without_hash = () => {
  acc_opened_id = ""
  document.body.style.overflow = "overlay"
  acc_full_token.classList.remove("slidein")
  acc_full_token.classList.add("slideout")
  acc_full_token.style.top = ""
  acc_back_fill.classList.remove("darkin")
  acc_back_fill.classList.add("darkout")
  acc_back_fill.style.opacity = ""
  acc_back_fill.style.visibility = "hidden"
  acc_token_info_container.style.height = ""
  document.dispatchEvent(new CustomEvent("remove_players", { detail: ["acc_full_token"] }))
}

const acc_open_full_token = (data, set, me) => {
  acc_opened_id = data.token_id
  const token_button = document.getElementById(`token_button_${data.token_id}`)
  if (token_button) {
    if (!token_button.classList.contains("card_active")) {
      token_button.classList.add("card_active")
      setTimeout(() => token_button.classList.remove("card_active"), 200)
    }
  }

  acc_token_def_name_value.innerHTML = `Token ${data.token_id}`

  const price_by_million = parseInt(data.price.slice(0, data.price.length - 18))
  const min_buy_fee_by_million = parseInt(royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18))

  const price_clear = price_by_million / 1000000
  let my_royalty_by_million = (price_by_million * royalty.my_royalty) / royalty.royalty_full
  if (my_royalty_by_million < min_buy_fee_by_million) my_royalty_by_million = min_buy_fee_by_million
  const price_royal = ((price_by_million * (royalty.royalty_full + royalty.creator_royalty)) / royalty.royalty_full + my_royalty_by_million) / 1000000

  acc_token_info.innerHTML = `
    <div id="token_button_acc_full_token" class="card full_token_card">
      <h3 class="card_title">${data.title}</h3>
      <div class="player_container" id="player_container_acc_full_token">
        ${
          data.status == "LockedToListen"
            ? `<h1 class="locked">Locked to listen</h1>`
            : `
          <div id="title_acc_full_token" class="player-title">
            <p class="time_container">
              <a id="timer_acc_full_token" class="player-timer">0:00</a> / <a id="duration_acc_full_token" class="player-duration">0:00</a>
            </p>
          </div>
          <div class="controlsOuter">
            <div class="controlsInner">
              <div id="loading_acc_full_token" class="player-loading"></div>
              <div class="btn player-playBtn" id="playBtn_acc_full_token"></div>
              <div class="btn player-pauseBtn" id="pauseBtn_acc_full_token"></div>
            </div>
          </div>
          <div id="waveform_acc_full_token" class="player-waveform"></div>
          <div id="progress_acc_full_token" class="player-progress"></div>
          `
        }
      </div>
    </div>
    <p class="token_description">${data.description}</p>
    ${me && set == "own" && data.selleble ? `<p class="token_price">Price setted to <a class="token_price_value">${price_clear} NEAR</a></p>` : ""}
    ${set != "lok" ? `<p class="token_price">${data.selleble ? `It costs <a class="token_price_value">${price_royal} NEAR</a>` : ""}</p>` : ""}
    <p class="token_creator">This token was created by <a class="account_id_button">${data.creator}</a> on <a class="token_date">
      ${new Date(Math.round(data.created_at / 1000000)).toGMTString().split(", ")[1].slice(0, -7)}
    </a></p>
    <p class="token_owner">Current owner is <a class="account_id_button">${data.owner_id}</a></p>
    <p class="token_owner">${set == "lok" ? "Was locked" : "Last was transferred"} on <a class="token_date">
      ${new Date(Math.round(data.transferred_at / 1000000)).toGMTString().split(", ")[1].slice(0, -7)}
    </a></p>
  `
  if (data.status != "LockedToListen") init_player(data.token_id, "acc_full_token")

  if (me) {
    if (set == "own") {
      acc_token_burn_button.style.display = "block"
      acc_token_buy_button.innerHTML = "Settings"
      acc_token_buy_button.classList.remove("button_disabled")
      acc_token_buy_button.classList.remove("sale_info")
      acc_token_buy_button.onclick = () => {
        acc_token_buy_button.classList.add("button_active")
        setTimeout(() => acc_token_buy_button.classList.remove("button_active"), 200)
        go_ford(`upd_${data.token_id}`)
      }
    } else if (set == "lok") {
      acc_token_burn_button.style.display = "block"
      acc_token_buy_button.innerHTML = "ⓘ Locked"
      acc_token_buy_button.classList.add("button_disabled")
      acc_token_buy_button.classList.add("sale_info")
      acc_token_buy_button.onclick = () => {}
    } else if (set == "crt") {
      acc_token_burn_button.style.display = "none"
      if (!data.selleble) {
        acc_token_buy_button.innerHTML = "ⓘ Not for sale"
        acc_token_buy_button.classList.add("button_disabled")
        acc_token_buy_button.classList.add("sale_info")
        acc_token_buy_button.onclick = () => {}
      } else if (account_near == data.owner_id) {
        acc_token_buy_button.innerHTML = "ⓘ It's your"
        acc_token_buy_button.classList.add("button_disabled")
        acc_token_buy_button.classList.add("sale_info")
        acc_token_buy_button.onclick = () => {}
      } else {
        acc_token_buy_button.innerHTML = "Buy"
        acc_token_buy_button.classList.remove("button_disabled")
        acc_token_buy_button.classList.remove("sale_info")
        acc_token_buy_button.onclick = () => {
          acc_token_buy_button.classList.add("button_active")
          setTimeout(() => acc_token_buy_button.classList.remove("button_active"), 200)
          go_ford(`buy_${data.token_id}`)
        }
      }
    }
  } else {
    acc_token_burn_button.style.display = "none"
    if (account_near == data.owner_id) {
      acc_token_buy_button.innerHTML = "ⓘ It's your"
      acc_token_buy_button.classList.add("button_disabled")
      acc_token_buy_button.classList.add("sale_info")
      acc_token_buy_button.onclick = () => {}
    } else if (!data.selleble) {
      acc_token_buy_button.innerHTML = "ⓘ Not for sale"
      acc_token_buy_button.classList.add("button_disabled")
      acc_token_buy_button.classList.add("sale_info")
      acc_token_buy_button.onclick = () => {}
    } else {
      acc_token_buy_button.innerHTML = "Buy"
      acc_token_buy_button.classList.remove("button_disabled")
      acc_token_buy_button.classList.remove("sale_info")
      acc_token_buy_button.onclick = () => {
        acc_token_buy_button.classList.add("button_active")
        setTimeout(() => acc_token_buy_button.classList.remove("button_active"), 200)
        go_ford(`buy_${data.token_id}`)
      }
    }
  }

  acc_token_burn_button.onclick = () => {
    acc_token_burn_button.classList.add("button_active")
    setTimeout(() => acc_token_burn_button.classList.remove("button_active"), 200)
    go_ford(`brn_${data.token_id}`)
  }

  document.body.style.overflow = "hidden"
  acc_full_token.classList.remove("slideout")
  acc_full_token.classList.add("slidein")
  acc_back_fill.style.visibility = "visible"
  acc_back_fill.classList.remove("darkout")
  acc_back_fill.classList.add("darkin")
  acc_token_info_container.style.height = `calc(${acc_token_info_container.clientHeight}px - ${menu.offsetHeight}px - ${acc_token_upbar.offsetHeight}px - ${acc_token_separator.offsetHeight}px)`
}

const acc_open_full_token_by_id = (id, set) => {
  const me = location.pathname.slice(9) == "" || location.pathname.slice(9) == account_near
  if (tokens[id] != null) acc_open_full_token(tokens[id], set, me)
  else
    fetch(`${server}/token/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data != null) acc_open_full_token(data, set, me)
        else location.hash = "#"
      })
}

const acc_move = event => {
  if (window.full_token_drag) {
    event.preventDefault()
    y = event.clientY || event.touches[0].clientY
    y -= window.full_token_offset
    y = y < 0 ? 0 : y
    const top = (y / window.innerHeight) * 100
    const opacity = 1 - y / window.innerHeight
    acc_full_token.style.top = y + "px"
    acc_back_fill.style.opacity = opacity
    acc_token_info_container.style.height = `calc(${100 - top}vh - ${menu.offsetHeight}px - ${acc_token_upbar.offsetHeight}px - ${
      acc_token_separator.offsetHeight
    }px)`
  }
}

// const acc_full_token_view_event_mousedown = event => {
//   window.full_token_drag = true
//   window.full_token_offset = (event.clientY || event.touches[0].clientY) - acc_full_token.getBoundingClientRect().top
// }
// const acc_full_token_view_event_mouseup_back = () => {
//   window.full_token_drag = false
// }
const acc_full_token_view_event_touchstart = event => {
  window.full_token_drag = true
  window.full_token_offset = (event.clientY || event.touches[0].clientY) - acc_full_token.getBoundingClientRect().top
}
const acc_full_token_view_event_touchend_back = () => {
  window.full_token_drag = false
}
// const acc_full_token_view_event_mouseup = () => {
//   if (acc_full_token.style.top.split("px")[0] > 0.42 * window.innerHeight) go_back("own_new")
// }
const acc_full_token_view_event_touchend = () => {
  if (acc_full_token.style.top.split("px")[0] > 0.42 * window.innerHeight) go_back("own_new")
}
// const acc_full_token_view_event_mousemove = acc_move
const acc_full_token_view_event_touchmove = acc_move
const acc_full_token_view_event_hash = () => {
  if (location.hash.slice(0, 9) == "#tok_own_" && location.hash.slice(9) != acc_opened_id) {
    acc_open_full_token_by_id(location.hash.slice(9), "own")
  } else if (location.hash.slice(0, 9) == "#tok_lok_" && location.hash.slice(9) != acc_opened_id) {
    acc_open_full_token_by_id(location.hash.slice(9), "lok")
  } else if (location.hash.slice(0, 9) == "#tok_crt_" && location.hash.slice(9) != acc_opened_id) {
    acc_open_full_token_by_id(location.hash.slice(9), "crt")
  }
  if (
    location.hash.slice(0, 5) != "#buy_" &&
    location.hash.slice(0, 5) != "#upd_" &&
    location.hash.slice(0, 5) != "#brn_" &&
    location.hash.slice(0, 5) != "#tok_"
  ) {
    acc_close_without_hash()
  }
}
const acc_full_token_view_event_click = () => {
  go_back("own_new")
}
const acc_full_token_view_event_escape = e => {
  if (e.key == "Escape" && (acc_opened_id != "" || popup_open)) {
    if (location.hash.slice(0, 5) != "#buy_" && location.hash.slice(0, 5) != "#upd_" && location.hash.slice(0, 5) != "#brn_") {
      go_back(`tok_crt_${location.hash.slice(5)}`)
    } else if (location.hash.slice(0, 5) != "#tok_") {
      go_back("own_new")
    }
  }
}

const init_acc_full_token_view_events = () => {
  acc_back_fill.addEventListener("click", acc_full_token_view_event_click)
  window.addEventListener("hashchange", acc_full_token_view_event_hash)
  // acc_full_token.addEventListener("mousedown", acc_full_token_view_event_mousedown)
  acc_full_token.addEventListener("touchstart", acc_full_token_view_event_touchstart)
  // acc_full_token.addEventListener("mouseup", acc_full_token_view_event_mouseup)
  acc_full_token.addEventListener("touchend", acc_full_token_view_event_touchend)
  // acc_back_fill.addEventListener("mouseup", acc_full_token_view_event_mouseup_back)
  acc_back_fill.addEventListener("touchend", acc_full_token_view_event_touchend_back)
  // acc_token_upbar.addEventListener("mousemove", acc_full_token_view_event_mousemove)
  acc_token_upbar.addEventListener("touchmove", acc_full_token_view_event_touchmove)
  document.addEventListener("keyup", acc_full_token_view_event_escape)
}
const dest_acc_full_token_view_events = () => {
  acc_back_fill.removeEventListener("click", acc_full_token_view_event_click)
  window.removeEventListener("hashchange", acc_full_token_view_event_hash)
  // acc_full_token.removeEventListener("mousedown", acc_full_token_view_event_mousedown)
  acc_full_token.removeEventListener("touchstart", acc_full_token_view_event_touchstart)
  // acc_full_token.removeEventListener("mouseup", acc_full_token_view_event_mouseup)
  acc_full_token.removeEventListener("touchend", acc_full_token_view_event_touchend)
  // acc_back_fill.removeEventListener("mouseup", acc_full_token_view_event_mouseup_back)
  acc_back_fill.removeEventListener("touchend", acc_full_token_view_event_touchend_back)
  // acc_token_upbar.removeEventListener("mousemove", acc_full_token_view_event_mousemove)
  acc_token_upbar.removeEventListener("touchmove", acc_full_token_view_event_touchmove)
  document.removeEventListener("keyup", acc_full_token_view_event_escape)
}

const init_acc_full_token_view = () => {
  if (location.hash.slice(0, 9) == "#tok_own_") {
    acc_open_full_token_by_id(location.hash.slice(9), "own")
  }
  if (location.hash.slice(0, 9) == "#tok_lok_") {
    acc_open_full_token_by_id(location.hash.slice(9), "lok")
  }
  if (location.hash.slice(0, 9) == "#tok_crt_") {
    acc_open_full_token_by_id(location.hash.slice(9), "crt")
  }
  init_acc_full_token_view_events()
}
const dest_acc_full_token_view = () => {
  acc_close_without_hash()
  dest_acc_full_token_view_events()
}
