let opened_id = ""

const close_without_hash = () => {
  opened_id = ""
  document.body.style.overflow = "overlay"
  full_token.classList.remove("slidein")
  full_token.classList.add("slideout")
  full_token.style.top = ""
  back_fill.classList.remove("darkin")
  back_fill.classList.add("darkout")
  back_fill.style.opacity = ""
  back_fill.style.visibility = "hidden"
  token_info_container.style.height = ""
  document.dispatchEvent(new CustomEvent("remove_players", { detail: ["main_full_token"] }))
}

const open_full_token = data => {
  opened_id = data.token_id
  const token_button = document.getElementById(`token_button_${data.token_id}`)
  if (token_button) {
    if (!token_button.classList.contains("card_active")) {
      token_button.classList.add("card_active")
      setTimeout(() => token_button.classList.remove("card_active"), 200)
    }
  }

  token_def_name_value.innerHTML = `Token ${data.token_id}`

  const price_by_million = parseInt(data.price.slice(0, data.price.length - 18))
  const min_buy_fee_by_million = parseInt(royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18))

  let my_royalty_by_million = (price_by_million * royalty.my_royalty) / royalty.royalty_full
  if (my_royalty_by_million < min_buy_fee_by_million) my_royalty_by_million = min_buy_fee_by_million
  const price = ((price_by_million * (royalty.royalty_full + royalty.creator_royalty)) / royalty.royalty_full + my_royalty_by_million) / 1000000

  token_info.innerHTML = `
    <div id="token_button_main_full_token" class="card full_token_card">
      <h3 class="card_title">${data.title}</h3>
      <div class="player_container" id="player_container_main_full_token">
        <div id="title_main_full_token" class="player-title">
          <p class="time_container">
            <a id="timer_main_full_token" class="player-timer">0:00</a> / <a id="duration_main_full_token" class="player-duration">0:00</a>
          </p>
        </div>
        <div class="controlsOuter">
          <div class="controlsInner">
            <div id="loading_main_full_token" class="player-loading"></div>
            <div class="btn player-playBtn" id="playBtn_main_full_token"></div>
            <div class="btn player-pauseBtn" id="pauseBtn_main_full_token"></div>
          </div>
        </div>
        <div id="waveform_main_full_token" class="player-waveform"></div>
        <div id="progress_main_full_token" class="player-progress"></div>
      </div>
    </div>
    <p class="token_description">${data.description}</p>
    ${data.selleble ? `<p class="token_price">It costs <a class="token_price_value">${price} NEAR</a></p>` : ""}
    <p class="token_creator">This token was created by <a class="account_id_button">${data.creator}</a> on <a class="token_date">
      ${new Date(Math.round(data.created_at / 1000000)).toGMTString().split(", ")[1].slice(0, -7)}
    </a></p>
    <p class="token_owner">Current owner is <a class="account_id_button">${data.owner_id}</a></p>
    <p class="token_owner">Last was transferred on <a class="token_date">
      ${new Date(Math.round(data.transferred_at / 1000000)).toGMTString().split(", ")[1].slice(0, -7)}
    </a></p>
  `

  init_player(data.token_id, "main_full_token")

  const action = () => {
    if (account_near == "") {
      token_buy_button.innerHTML = data.selleble ? "Buy" : "Sign in"
      token_buy_button.classList.remove("button_disabled")
      token_buy_button.classList.remove("sale_info")
      token_buy_button.onclick = () => {
        token_buy_button.classList.add("button_active")
        setTimeout(() => token_buy_button.classList.remove("button_active"), 200)
        logout_near()
        login_near()
      }

      token_report_speech_button.style.display = "none"
      token_report_offence_button.style.display = "none"
    } else if (data.owner_id == account_near) {
      token_buy_button.innerHTML = "ⓘ It's your"
      token_buy_button.classList.add("button_disabled")
      token_buy_button.classList.add("sale_info")
      token_buy_button.onclick = () => {}

      token_report_speech_button.style.display = "block"
      token_report_offence_button.style.display = "block"
    } else if (!data.selleble) {
      token_buy_button.innerHTML = "ⓘ Not for sale"
      token_buy_button.classList.add("button_disabled")
      token_buy_button.classList.add("sale_info")
      token_buy_button.onclick = () => {}

      token_report_speech_button.style.display = "block"
      token_report_offence_button.style.display = "block"
    } else {
      token_buy_button.innerHTML = "Buy"
      token_buy_button.classList.remove("button_disabled")
      token_buy_button.classList.remove("sale_info")
      token_buy_button.onclick = () => {
        token_buy_button.classList.add("button_active")
        setTimeout(() => token_buy_button.classList.remove("button_active"), 200)
        go_ford(`buy_${data.token_id}`)
      }

      token_report_speech_button.style.display = "block"
      token_report_offence_button.style.display = "block"
    }
  }
  account_near == null ? document.addEventListener("change_account_near", action, { once: true }) : action()

  if (data.reports_speech.includes(" " + account_near + " ")) {
    token_report_speech_button.innerHTML = "Report on voice-spam sent"
    token_report_speech_button.classList.add("button_disabled")
    token_report_speech_button.onclick = () => {}
  } else {
    token_report_speech_button.innerHTML = "Report voice-spam or speech"
    token_report_speech_button.classList.remove("button_disabled")
    token_report_speech_button.onclick = () => go_ford(`rvs_${data.token_id}`)
  }
  if (data.reports_offence.includes(" " + account_near + " ")) {
    token_report_offence_button.innerHTML = "Report on abusive content sent"
    token_report_offence_button.classList.add("button_disabled")
    token_report_offence_button.onclick = () => {}
  } else {
    token_report_offence_button.innerHTML = "Report abusive content"
    token_report_offence_button.classList.remove("button_disabled")
    token_report_offence_button.onclick = () => go_ford(`roc_${data.token_id}`)
  }

  document.body.style.overflow = "hidden"
  full_token.classList.remove("slideout")
  full_token.classList.add("slidein")
  back_fill.style.visibility = "visible"
  back_fill.classList.remove("darkout")
  back_fill.classList.add("darkin")
  const style = token_info_container.currentStyle || window.getComputedStyle(token_info_container)
  token_info_container.style.height = `calc(${token_info_container.clientHeight}px - ${menu.offsetHeight}px - ${token_upbar.offsetHeight}px - ${token_separator.offsetHeight}px)`
}

const open_full_token_by_id = (id, redirect_buy) => {
  if (tokens[id] != null) {
    if (redirect_buy) {
      history.replaceState({}, "", `#tok_${id}`)
      if (tokens[id].owner_id != account_near) go_ford(`#buy_${id}`)
    } else open_full_token(tokens[id])
  } else
    fetch(`${server}/token/${id}`)
      .then(response => response.json())
      .then(data => {
        if (redirect_buy) {
          history.replaceState({}, "", `#tok_${id}`)
          if (data.owner_id != account_near) go_ford(`#buy_${id}`)
        } else if (data != null) open_full_token(data)
        else location.hash = "#"
      })
}

const move = event => {
  if (window.full_token_drag) {
    event.preventDefault()
    y = event.clientY || event.touches[0].clientY
    y -= window.full_token_offset
    y = y < 0 ? 0 : y
    const top = (y / window.innerHeight) * 100
    const opacity = 1 - y / window.innerHeight
    full_token.style.top = y + "px"
    back_fill.style.opacity = opacity
    const style = token_info_container.currentStyle || window.getComputedStyle(token_info_container)
    token_info_container.style.height = `calc(${100 - top}vh - ${menu.offsetHeight}px - ${token_upbar.offsetHeight}px - ${token_separator.offsetHeight}px)`
  }
}

// const full_token_view_event_mousedown = event => {
//   window.full_token_drag = true
//   window.full_token_offset = (event.clientY || event.touches[0].clientY) - full_token.getBoundingClientRect().top
// }
// const full_token_view_event_mouseup_back = () => {
//   window.full_token_drag = false
// }
const full_token_view_event_touchstart = event => {
  window.full_token_drag = true
  window.full_token_offset = (event.clientY || event.touches[0].clientY) - full_token.getBoundingClientRect().top
}
const full_token_view_event_touchend_back = () => {
  window.full_token_drag = false
}
// const full_token_view_event_mouseup = () => {
//   if (full_token.style.top.split("px")[0] > 0.42 * window.innerHeight) go_back("pop")
// }
const full_token_view_event_touchend = () => {
  if (full_token.style.top.split("px")[0] > 0.42 * window.innerHeight) go_back("pop")
}
// const full_token_view_event_mousemove = move
const full_token_view_event_touchmove = move
const full_token_view_event_hash = () => {
  if (location.hash.slice(0, 9) == "#tok_buy_") {
    open_full_token_by_id(location.hash.slice(9), true)
  } else if (location.hash.slice(0, 5) == "#tok_" && location.hash.slice(5) != opened_id) {
    open_full_token_by_id(location.hash.slice(5))
  }
  if (
    location.hash.slice(0, 5) != "#buy_" &&
    location.hash.slice(0, 5) != "#rvs_" &&
    location.hash.slice(0, 5) != "#roc_" &&
    location.hash.slice(0, 5) != "#tok_"
  ) {
    close_without_hash()
  }
}
const full_token_view_event_click = () => {
  go_back("pop")
}
const full_token_view_event_escape = e => {
  if (e.key == "Escape" && (opened_id != "" || popup_open)) {
    if (location.hash.slice(0, 5) != "#buy_" && location.hash.slice(0, 5) != "#rvs_" && location.hash.slice(0, 5) != "#roc_") {
      go_back(`tok_${location.hash.slice(5)}`)
    } else if (location.hash.slice(0, 5) != "#tok_") {
      go_back("pop")
    }
  }
}

const init_full_token_view_events = () => {
  back_fill.addEventListener("click", full_token_view_event_click)
  window.addEventListener("hashchange", full_token_view_event_hash)
  // full_token.addEventListener("mousedown", full_token_view_event_mousedown)
  full_token.addEventListener("touchstart", full_token_view_event_touchstart)
  // full_token.addEventListener("mouseup", full_token_view_event_mouseup)
  full_token.addEventListener("touchend", full_token_view_event_touchend)
  // back_fill.addEventListener("mouseup", full_token_view_event_mouseup_back)
  back_fill.addEventListener("touchend", full_token_view_event_touchend_back)
  // token_upbar.addEventListener("mousemove", full_token_view_event_mousemove)
  token_upbar.addEventListener("touchmove", full_token_view_event_touchmove)
  document.addEventListener("keyup", full_token_view_event_escape)
}
const dest_full_token_view_events = () => {
  back_fill.removeEventListener("click", full_token_view_event_click)
  window.removeEventListener("hashchange", full_token_view_event_hash)
  // full_token.removeEventListener("mousedown", full_token_view_event_mousedown)
  full_token.removeEventListener("touchstart", full_token_view_event_touchstart)
  // full_token.removeEventListener("mouseup", full_token_view_event_mouseup)
  full_token.removeEventListener("touchend", full_token_view_event_touchend)
  // back_fill.removeEventListener("mouseup", full_token_view_event_mouseup_back)
  back_fill.removeEventListener("touchend", full_token_view_event_touchend_back)
  // token_upbar.removeEventListener("mousemove", full_token_view_event_mousemove)
  token_upbar.removeEventListener("touchmove", full_token_view_event_touchmove)
  document.removeEventListener("keyup", full_token_view_event_escape)
}

const init_full_token_view = () => {
  if (location.hash.slice(0, 9) == "#tok_buy_") {
    open_full_token_by_id(location.hash.slice(9), true)
  } else if (location.hash.slice(0, 5) == "#tok_") {
    open_full_token_by_id(location.hash.slice(5))
  }
  init_full_token_view_events()
}
const dest_full_token_view = () => {
  close_without_hash()
  dest_full_token_view_events()
}
