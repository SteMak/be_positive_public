let acc_on_load = false

const acc_add_cards = (data, set, me, acc_id) => {
  alien_account_header.style.display = me ? "none" : "block"
  alien_account_header_name.innerHTML = `Account of ${acc_id}`
  account_header.style.display = me ? "block" : "none"

  for (const dat of data) {
    tokens[dat.token_id] = dat

    const price_by_million = parseInt(dat.price.slice(0, dat.price.length - 18))
    const min_buy_fee_by_million = parseInt(royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18))

    let my_royalty_by_million = (price_by_million * royalty.my_royalty) / royalty.royalty_full
    if (my_royalty_by_million < min_buy_fee_by_million) my_royalty_by_million = min_buy_fee_by_million
    const price = ((price_by_million * (royalty.royalty_full + royalty.creator_royalty)) / royalty.royalty_full + my_royalty_by_million) / 1000000

    const post = document.createElement("div")
    post.innerHTML = `
      <h3 class="card_title">${dat.title}</h3>
      <div class="player_container" id="player_container_${dat.token_id}">
        ${
          dat.status == "LockedToListen"
            ? `<h1 class="locked">Locked to listen</h1>`
            : `
          <div id="title_${dat.token_id}" class="player-title">
            <p class="time_container">
              <a id="timer_${dat.token_id}" class="player-timer">0:00</a> / <a id="duration_${dat.token_id}" class="player-duration">0:00</a>
            </p>
          </div>
          <div class="controlsOuter">
            <div class="controlsInner">
              <div id="loading_${dat.token_id}" class="player-loading"></div>
              <div class="btn player-playBtn" id="playBtn_${dat.token_id}"></div>
              <div class="btn player-pauseBtn" id="pauseBtn_${dat.token_id}"></div>
            </div>
          </div>
          <div id="waveform_${dat.token_id}" class="player-waveform"></div>
          <div id="progress_${dat.token_id}" class="player-progress"></div>
          `
        }
      </div>
      <div class="card_info">
        <div class="card_footer">
          <p class="card_price">${dat.selleble && set != "lok" ? `Price: <a class="card_price_value">${price} NEAR</a>` : "Not for sale"}</p>
          <a class="more_button"></a>
        </div>
      </div>
    `

    post.className = "card"
    post.id = `token_button_${dat.token_id}`
    post.onclick = () => go_ford(`tok_${cards_filt.set}_${dat.token_id}`)
    acc_cards.appendChild(post)

    if (dat.status != "LockedToListen") init_player(dat.token_id)
  }
  if (data.length < amount_to_load && !last_card) {
    last_card = true
    const post = document.createElement("div")
    post.innerHTML = `
      <h3 class="card_title">Nothing ${data.length ? "else " : ""}found</h3>
    `
    post.classList.add("card")
    post.classList.add("nothing_card")
    post.id = "nothing_card"
    acc_cards.parentNode.insertBefore(post, acc_cards.nextSibling)
  }

  acc_on_load = false
}
const acc_add_sign_in_card = () => {
  account_header.style.display = "block"
  alien_account_header.style.display = "none"

  last_card = true
  const post = document.createElement("div")
  post.innerHTML = `
    <h3 class="card_title">Please, sign in to see your tokens</h3>
    <div class="card_sign_in">
      <a class="button button_card_sign_in">Sign in</a>
    </div>
  `
  post.className = "card"
  post.onclick = () => {
    post.classList.add("card_active")
    setTimeout(() => post.classList.remove("card_active"), 200)
    login_near()
  }
  acc_cards.appendChild(post)

  const post_no = document.createElement("div")
  post_no.innerHTML = ""
  post_no.classList.add("card")
  post_no.classList.add("nothing_card")
  post_no.id = "nothing_card"
  acc_cards.parentNode.insertBefore(post_no, acc_cards.nextSibling)
}
const acc_remove_cards = () => {
  const remove_ids = []
  for (let i = 0; i < acc_cards.children.length; i++) {
    remove_ids.push(acc_cards.children[i].id.slice(13))
  }
  document.dispatchEvent(new CustomEvent("remove_players", { detail: remove_ids }))
  acc_cards.innerHTML = ""
  if (acc_cards.nextSibling.id == "nothing_card") {
    acc_cards.nextSibling.remove()
  }
}

const acc_load_cards = () => {
  if (acc_on_load) return
  acc_on_load = true

  const sort_str = `${cards_sort.order}-${cards_sort.direction}/${cards_sort.selleble}`
  const owner = location.pathname.slice(9) || account_near
  const me = location.pathname.slice(9) == "" || location.pathname.slice(9) == account_near
  const filt_str = cards_filt.set == "lok" ? `own/${owner}/true` : `${cards_filt.set}/${owner}/false`
  if (owner != "") {
    fetch(`${server}/owner_tokens/${filt_str}/${sort_str}/${(current_offset += amount_to_load)}-${amount_to_load}`)
      .then(response => response.json())
      .then(data => {
        if (current_offset == 0) {
          if (data.length == 0) {
            acc_play_all.classList.add("play_all_hidden")
            acc_al_play_all.classList.add("play_all_hidden")
            morda_1.classList.add("morda_1_hidden")
          } else {
            acc_play_all.classList.remove("play_all_hidden")
            acc_al_play_all.classList.remove("play_all_hidden")
            morda_1.classList.remove("morda_1_hidden")
          }
        }
        acc_add_cards(data, cards_filt.set, me, location.pathname.slice(9))
      })
  } else {
    acc_play_all.classList.add("play_all_hidden")
    acc_al_play_all.classList.add("play_all_hidden")
    morda_1.classList.add("morda_1_hidden")

    acc_add_sign_in_card()
    acc_on_load = false
  }
}

const acc_init_load_cards = () => {
  acc_remove_cards()
  last_card = false
  current_offset = -amount_to_load
  acc_load_cards()
}

const acc_scroll_load_cards = () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  if (scrollHeight == scrollTop + clientHeight) window.scrollBy(0, -1)
  if (scrollTop + clientHeight > scrollHeight - 100 && !last_card) {
    acc_load_cards()
  }
}

const acc_loading_cards_event_scroll = acc_scroll_load_cards
const acc_loading_cards_event_search = acc_init_load_cards

const init_acc_loading_cards_events = () => {
  document.addEventListener("scroll", acc_loading_cards_event_scroll)
  document.addEventListener("searchchanged", acc_loading_cards_event_search)
}
const dest_acc_loading_cards_events = () => {
  document.removeEventListener("scroll", acc_loading_cards_event_scroll)
  document.removeEventListener("searchchanged", acc_loading_cards_event_search)
}

const init_acc_loading_cards = () => {
  dom_content_loaded ? acc_init_load_cards() : document.addEventListener("DOMContentLoaded", acc_init_load_cards, { once: true })
  init_acc_loading_cards_events()
}
const dest_acc_loading_cards = () => {
  acc_remove_cards()
  dest_acc_loading_cards_events()
}
