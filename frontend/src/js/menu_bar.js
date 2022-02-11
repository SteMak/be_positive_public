let pathname = location.pathname

const init_main_page = () => {
  document.title = "Haher - Gallery"
  main_page.style.display = "block"
  morda_1.style.display = ""
  init_actualize_history("/")
  init_sort_interaction()
  init_loading_cards()
  init_token_buy()
  init_reports()
  init_full_token_view()
  init_top_button()
}
const dest_main_page = () => {
  main_page.style.display = "none"
  dest_actualize_history()
  dest_sort_interaction()
  dest_loading_cards()
  dest_token_buy()
  dest_reports()
  dest_full_token_view()
  dest_top_button()
}

const init_account = title => {
  document.title = `Haher - ${title}`
  account_page.style.display = "block"
  morda_1.style.display = ""
  init_actualize_history("/account")
  init_acc_sort_interaction()
  init_acc_filt_interaction()
  init_acc_loading_cards()
  init_acc_token_buy()
  init_acc_token_burn()
  init_acc_token_update()
  init_acc_full_token_view()
  init_acc_top_button()
}
const dest_account = () => {
  account_page.style.display = "none"
  dest_actualize_history()
  dest_acc_sort_interaction()
  dest_acc_filt_interaction()
  dest_acc_loading_cards()
  dest_acc_token_buy()
  dest_acc_token_burn()
  dest_acc_token_update()
  dest_acc_full_token_view()
  dest_acc_top_button()
}

const init_new_nft = () => {
  document.title = "Haher - Create"
  morda_1.style.display = "none"
  new_page.style.display = "block"
  init_actualize_history("/new")
  init_new_nft_page()
}
const dest_new_nft = () => {
  new_page.style.display = "none"
  dest_actualize_history()
  dest_new_nft_page()
}

const open_main_page = add_to_history => {
  menu_gallery.classList.add("menu_item_active")
  menu_create.classList.remove("menu_item_active")
  menu_account.classList.remove("menu_item_active")
  if (add_to_history) history.pushState({}, "", "/")
  dest_account()
  dest_main_page()
  dest_new_nft()
  init_main_page()
}
const open_new_nft = add_to_history => {
  menu_gallery.classList.remove("menu_item_active")
  menu_create.classList.add("menu_item_active")
  menu_account.classList.remove("menu_item_active")
  if (add_to_history) history.pushState({}, "", "/new")
  dest_account()
  dest_main_page()
  dest_new_nft()
  init_new_nft()
}
const open_account = add_to_history => {
  menu_gallery.classList.remove("menu_item_active")
  menu_create.classList.remove("menu_item_active")
  menu_account.classList.add("menu_item_active")
  if (add_to_history) history.pushState({}, "", "/account")
  dest_account()
  dest_main_page()
  dest_new_nft()
  init_account("Account")
}
const open_alien_account = (add_to_history, id) => {
  menu_gallery.classList.remove("menu_item_active")
  menu_create.classList.remove("menu_item_active")
  menu_account.classList.remove("menu_item_active")
  if (add_to_history) history.pushState({}, "", `/account_${id}`)
  dest_account()
  dest_main_page()
  dest_new_nft()
  init_account(id)
}

const go_alien_account = id => {
  if (id == account_near) open_account(true)
  else open_alien_account(true, id)
}
const menu_bar_event_click_alien = event => {
  if (event.target.classList.contains("account_id_button")) {
    go_alien_account(event.target.innerHTML)
  }
}

const menu_bar_event_popstate = () => {
  if (pathname != location.pathname) {
    pathname = location.pathname
    if (location.pathname == "/") open_main_page()
    else if (location.pathname == "/new") open_new_nft()
    else if (location.pathname == "/account") open_account()
    else if (location.pathname.slice(0, 9) == "/account_") {
      if (location.pathname.slice(9) == account_near) {
        history.replaceState({}, "", "/account")
        open_account()
      } else open_alien_account()
    }
  }
}

const menu_bar_event_location = () => (pathname = location.pathname)
const menu_bar_event_click_menu_gallery = () => open_main_page(true)
const menu_bar_event_click_menu_create = () => open_new_nft(true)
const menu_bar_event_click_menu_account = () => open_account(true)

const init_menu_bar_events = () => {
  window.addEventListener("popstate", menu_bar_event_popstate)
  window.addEventListener("historyupdate", menu_bar_event_location)
  menu_gallery.addEventListener("click", menu_bar_event_click_menu_gallery)
  menu_create.addEventListener("click", menu_bar_event_click_menu_create)
  menu_account.addEventListener("click", menu_bar_event_click_menu_account)
  document.addEventListener("click", menu_bar_event_click_alien)
}
const dest_menu_bar_events = () => {
  window.removeEventListener("popstate", menu_bar_event_popstate)
  window.removeEventListener("historyupdate", menu_bar_event_location)
  menu_gallery.removeEventListener("click", menu_bar_event_click_menu_gallery)
  menu_create.removeEventListener("click", menu_bar_event_click_menu_create)
  menu_account.removeEventListener("click", menu_bar_event_click_menu_account)
  document.removeEventListener("click", menu_bar_event_click_alien)
}

const init_menu_bar = () => {
  if (location.pathname == "/") {
    menu_gallery.classList.add("menu_item_active")
    init_main_page()
  } else if (location.pathname == "/new") {
    menu_create.classList.add("menu_item_active")
    init_new_nft()
  } else if (location.pathname == "/account") {
    menu_account.classList.add("menu_item_active")
    init_account("Account")
  } else if (location.pathname.slice(0, 9) == "/account_") {
    if (location.pathname.slice(9) == account_near) {
      history.replaceState({}, "", "/account")
    }
    init_account(location.pathname.slice(9))
  }
  init_menu_bar_events()
}
const dest_menu_bar = () => {
  dest_menu_bar_events()
}
