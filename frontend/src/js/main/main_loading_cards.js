let on_load = false

const add_cards = data => {
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
      </div>
      <div class="card_info">
        <div class="card_footer">
          <p class="card_price">${dat.selleble ? `Price: <a class="card_price_value">${price} NEAR</a>` : "Not for sale"}</p>
          <a class="more_button"></a>
        </div>
      </div>
    `

    post.className = "card"
    post.id = `token_button_${dat.token_id}`
    post.onclick = () => go_ford(`tok_${dat.token_id}`)
    cards.appendChild(post)

    init_player(dat.token_id)
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
    cards.parentNode.insertBefore(post, cards.nextSibling)
  }

  on_load = false
}
const remove_cards = () => {
  const remove_ids = []
  for (let i = 0; i < cards.children.length; i++) {
    remove_ids.push(cards.children[i].id.slice(13))
  }
  document.dispatchEvent(new CustomEvent("remove_players", { detail: remove_ids }))
  cards.innerHTML = ""
  if (cards.nextSibling.id == "nothing_card") {
    cards.nextSibling.remove()
  }
}

const load_cards = () => {
  if (on_load) return
  on_load = true

  const sort_str = `${cards_sort.order}-${cards_sort.direction}/${cards_sort.selleble}`
  if (account_near != "") {
    fetch(`${server}/tokens/false/${sort_str}/${(current_offset += amount_to_load)}-${amount_to_load}`)
      .then(response => response.json())
      .then(data => {
        if (current_offset == 0) {
          if (data.length == 0) {
            play_all.classList.add("play_all_hidden")
            morda_1.classList.add("morda_1_hidden")
          } else {
            play_all.classList.remove("play_all_hidden")
            morda_1.classList.remove("morda_1_hidden")
          }
        }
        add_cards(data)
      })
  } else {
    fetch(`${server}/tokens/true/${sort_str}/${(current_offset += amount_to_load)}-${amount_to_load}`)
      .then(response => response.json())
      .then(data => {
        if (current_offset == 0) {
          if (data.length == 0) {
            play_all.classList.add("play_all_hidden")
            morda_1.classList.add("morda_1_hidden")
          } else {
            play_all.classList.remove("play_all_hidden")
            morda_1.classList.remove("morda_1_hidden")
          }
        }
        add_cards(data)
      })
  }
}

const init_load_cards = sort => {
  remove_cards()
  last_card = false
  current_offset = -amount_to_load
  load_cards(sort)
}

const scroll_load_cards = () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  if (scrollHeight == scrollTop + clientHeight) window.scrollBy(0, -1)
  if (scrollTop + clientHeight > scrollHeight - 100 && !last_card) {
    load_cards()
  }
}

const loading_cards_event_scroll = scroll_load_cards
const loading_cards_event_search = init_load_cards

const init_loading_cards_events = () => {
  document.addEventListener("scroll", loading_cards_event_scroll)
  document.addEventListener("searchchanged", loading_cards_event_search)
}
const dest_loading_cards_events = () => {
  document.removeEventListener("scroll", loading_cards_event_scroll)
  document.removeEventListener("searchchanged", loading_cards_event_search)
}

const init_loading_cards = () => {
  dom_content_loaded ? init_load_cards() : document.addEventListener("DOMContentLoaded", init_load_cards, { once: true })
  init_loading_cards_events()
}
const dest_loading_cards = () => {
  remove_cards()
  dest_loading_cards_events()
}
