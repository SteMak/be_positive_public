const royalty = {
  mint_price: "50000000000000000000000",
  min_pricing_fee: "3000000000000000000000",
  min_transfer_fee: "3000000000000000000000",
  min_buy_fee: "5000000000000000000000",
  creator_royalty: 100,
  my_royalty: 50,
  royalty_full: 10000,
}

const tokens = {}
const domen = location.origin
const server = location.origin
const amount_to_load = 12
let current_offset = -amount_to_load
let cards_sort = { order: "", direction: "", selleble: "", set: "" }
let cards_filt = { owner: "", creator: "", bad_status: "", set: "" }
let last_card = false

let popup_open = false

let init_player

const main_page = document.getElementById("main_page")
const account_page = document.getElementById("account_page")
const new_page = document.getElementById("new_page")

const menu = document.getElementById("menu")
const menu_gallery = document.getElementById(menu_ids.gallery)
const menu_create = document.getElementById(menu_ids.create)
const menu_account = document.getElementById(menu_ids.account)

const sign_in = document.getElementById("sign_in")

const volume_mic = document.getElementById("volume_mic")
const volume_height = 17
const volume_padding = 10
const volume_button_size = 20
const volume_placeholder = document.getElementById("volume_placeholder")
const volume_button = document.getElementById("volume_button")
const volume_active = document.getElementById("volume_active")

const morda_1 = document.getElementById("morda_1")
const morda_1_gif = document.getElementById("morda_1_gif")
const morda_1_png = document.getElementById("morda_1_png")

let play_all_playing = false
let play_indexes = []
let play_all_indexes = []
const play_all = document.getElementById("play_all")
const play_all_play = document.getElementById("play_all_play")
const play_all_pause = document.getElementById("play_all_pause")
const acc_play_all = document.getElementById("acc_play_all")
const acc_play_all_play = document.getElementById("acc_play_all_play")
const acc_play_all_pause = document.getElementById("acc_play_all_pause")
const acc_al_play_all = document.getElementById("acc_al_play_all")
const acc_al_play_all_play = document.getElementById("acc_al_play_all_play")
const acc_al_play_all_pause = document.getElementById("acc_al_play_all_pause")

const blur_back = document.getElementById(blur_id)
const back_video = document.getElementById("back_video")

// Main page
const sort_newest = document.getElementById("sort_newest")
const sort_popular = document.getElementById("sort_popular")
const sort_cheapest = document.getElementById("sort_cheapest")

const cards = document.getElementById("cards")

const full_token = document.getElementById("full_token")
const back_fill = document.getElementById("back_fill")
const token_upbar = document.getElementById("token_upbar")
const token_separator = document.getElementById("token_separator")
const token_def_name_value = document.getElementById("token_def_name_value")
const token_info_container = document.getElementById("token_info_container")
const token_info = document.getElementById("token_info")
const token_buy_button = document.getElementById("token_buy_button")
const token_report_speech_button = document.getElementById("token_report_speech_button")
const token_report_offence_button = document.getElementById("token_report_offence_button")

const popup_window = document.getElementById("popup_window")
const back_fill_popup = document.getElementById("back_fill_popup")
const popup_upbar_purchase = document.getElementById("popup_upbar_purchase")
const popup_upbar_success_purchase = document.getElementById("popup_upbar_success_purchase")
const popup_upbar_report = document.getElementById("popup_upbar_report")
const popup_info_container = document.getElementById("popup_info_container")
const popup_info_purchase = document.getElementById("popup_info_purchase")
const popup_info_success_purchase = document.getElementById("popup_info_success_purchase")
const popup_error_purchase = document.getElementById("popup_error_purchase")
const popup_info_report_speech = document.getElementById("popup_info_report_speech")
const popup_info_report_offence = document.getElementById("popup_info_report_offence")
const popup_buy_button = document.getElementById("popup_buy_button")
const popup_report_button = document.getElementById("popup_report_button")

const top_button = document.getElementById("top_button")

let hist = null

// Account page
const account_header = document.getElementById("account_header")
const alien_account_header = document.getElementById("alien_account_header")
const alien_account_header_name = document.getElementById("alien_account_header_name")

const acc_sort_newest = document.getElementById("acc_sort_newest")
const acc_sort_richest = document.getElementById("acc_sort_richest")
const acc_sort_cheapest = document.getElementById("acc_sort_cheapest")

const acc_filt_owned = document.getElementById("acc_filt_owned")
const acc_filt_locked = document.getElementById("acc_filt_locked")
const acc_filt_created = document.getElementById("acc_filt_created")

const acc_cards = document.getElementById("acc_cards")

const acc_full_token = document.getElementById("acc_full_token")
const acc_back_fill = document.getElementById("acc_back_fill")
const acc_token_upbar = document.getElementById("acc_token_upbar")
const acc_token_separator = document.getElementById("acc_token_separator")
const acc_token_def_name_value = document.getElementById("acc_token_def_name_value")
const acc_token_info_container = document.getElementById("acc_token_info_container")
const acc_token_info = document.getElementById("acc_token_info")
const acc_token_buy_button = document.getElementById("acc_token_buy_button")
const acc_token_burn_button = document.getElementById("acc_token_burn_button")

const acc_popup_window = document.getElementById("acc_popup_window")
const acc_back_fill_popup = document.getElementById("acc_back_fill_popup")
const acc_popup_info_container = document.getElementById("acc_popup_info_container")

const acc_popup_upbar_purchase = document.getElementById("acc_popup_upbar_purchase")
const acc_popup_upbar_success_purchase = document.getElementById("acc_popup_upbar_success_purchase")
const acc_popup_info_purchase = document.getElementById("acc_popup_info_purchase")
const acc_popup_info_success_purchase = document.getElementById("acc_popup_info_success_purchase")
const acc_popup_error_purchase = document.getElementById("acc_popup_error_purchase")
const acc_popup_buy_button = document.getElementById("acc_popup_buy_button")

const acc_popup_upbar_burn = document.getElementById("acc_popup_upbar_burn")
const acc_popup_upbar_success_burn = document.getElementById("acc_popup_upbar_success_burn")
const acc_popup_info_success_burn = document.getElementById("acc_popup_info_success_burn")
const acc_popup_info_burn = document.getElementById("acc_popup_info_burn")
const acc_popup_info_burn_input = document.getElementById("acc_popup_info_burn_input")
const acc_popup_info_burn_load = document.getElementById("acc_popup_info_burn_load")
const acc_popup_error_burn = document.getElementById("acc_popup_error_burn")
const acc_popup_burn_button = document.getElementById("acc_popup_burn_button")

const acc_popup_upbar_update = document.getElementById("acc_popup_upbar_update")
const acc_popup_upbar_success_update = document.getElementById("acc_popup_upbar_success_update")
const acc_popup_info_update = document.getElementById("acc_popup_info_update")
const acc_popup_info_success_update = document.getElementById("acc_popup_info_success_update")
const acc_popup_info_update_input_selleble = document.getElementById("acc_popup_info_update_input_selleble")
const acc_popup_info_row_container_selleble = document.getElementById("acc_popup_info_row_container_selleble")
const acc_popup_info_update_input_price = document.getElementById("acc_popup_info_update_input_price")
const acc_popup_error_update = document.getElementById("acc_popup_error_update")
const acc_popup_update_button = document.getElementById("acc_popup_update_button")

const popup_author_fee = document.getElementById("popup_author_fee")
const popup_contract_fee = document.getElementById("popup_contract_fee")
const popup_contract_min_fee = document.getElementById("popup_contract_min_fee")
const popup_contract_author_fee = document.getElementById("popup_contract_author_fee")

// Account page
const new_create = document.getElementById("new_create")
const new_finish = document.getElementById("new_finish")
const new_error = document.getElementById("new_error")
const new_banned = document.getElementById("new_banned")

const create_title = document.getElementById("create_title")
const create_description = document.getElementById("create_description")
const create_selleble = document.getElementById("create_selleble")
const create_price = document.getElementById("create_price")
const create_file = document.getElementById("create_file")
const create_button = document.getElementById("create_button")
const create_back_warning = document.getElementById("create_back_warning")
const create_info_warning_empty = document.getElementById("create_info_warning_empty")
const create_info_warning_bad_file = document.getElementById("create_info_warning_bad_file")
const create_info_row_container_price = document.getElementById("create_info_row_container_price")

const create_author_fee = document.getElementById("create_author_fee")
const create_contract_fee = document.getElementById("create_contract_fee")
const create_contract_min_fee = document.getElementById("create_contract_min_fee")
const create_contract_author_fee = document.getElementById("create_contract_author_fee")

const create_file_style = document.getElementById("create_file_style")

const create_finish_button = document.getElementById("create_finish_button")
const finish_loading_anim = document.getElementById("finish_loading_anim")
