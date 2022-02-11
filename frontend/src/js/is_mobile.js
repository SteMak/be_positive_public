const mobile_style = document.getElementById("mobile_style")

const menu_ids = {
  gallery: "",
  create: "",
  account: "",
}
let blur_id = ""

let volume_setting = false

const is_mobile = () => {
  return (navigator.userAgentData || { mobile: false }).mobile || window.innerWidth < 670 || window.innerHeight < 590
}

const mobile_style_define = () => {
  if (is_mobile()) {
    mobile_style.innerHTML = `
      .header {
        background-color: var(--inverse-main);
      }
      .account_id.button {
        background-color: var(--button-bar-mobile);
      }
      .account_id.button:active {
        background-color: var(--button-bar-mobile-active);
      }
      .sidebar {
        display: none;
      }
      .morda_1 {
        display:none;
        right: 20px;
        top: 70px;
        height: 48px;
      }
      .morda_1_back {
        display:none;
        height: 500px;
        width: 500px;
        transform: translate(250px, -250px);
      }
      .morda_logo_back {
        display:none;
      }

      .nothing_card {
        display: block;
        margin-bottom: 112px;
        margin-left: auto;
        margin-right: auto;
        background-color: var(--invisible);
        padding: 0;
      }
      .nothing_card:hover {
        background-color: var(--invisible);
      }

      .nothing_card .card_title {
        text-align: left;
      }

      .token_upbar {
        padding-top: min(7.5vw, 44.1px);
        padding-bottom: 5px;
      }
      .popup_window {
        margin-left: 5.5px;
        border-radius: 6px;
        padding: 15px;
        padding-bottom: 10px;
      }
      @media screen and (orientation:portrait) {
        .play_all_row {
          margin-top: 150px;
        }
        .back_video {
          left: calc(50% - 83px);
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      
      `
    blur_id = "blur_button_mobile"
    menu_ids.gallery = "menu_gallery"
    menu_ids.create = "menu_create"
    menu_ids.account = "menu_account"
  } else {
    mobile_style.innerHTML = `
      .header {
        background-color: var(--straight-light);
        position: fixed;
        z-index: 1000;
      }
      .menu {
        display: none;
      }
      .main_container {
        padding-left: 98px;
        padding-top: 60px;
      }
      .back_fill {
        z-index: 200;
      }
      .full_token {
        z-index: 200;
        margin-left: calc(50vw - 280px - 98px + 5.5px);
        width: min(560px, calc(100vw - 98px));
        height: auto;
        border-radius: 6px;
      }
      
      .back_fill_popup {
        z-index: 300;
      }
      .popup_window {
        z-index: 300;
        margin-left: 5.5px;
        border-radius: 6px;
        padding: 15px;
        padding-bottom: 10px;
      }
      .token_info_container {
        margin-bottom: 26px;
        height: auto !important;
        max-height: calc(80vh - 80px);
      }
      .cards {
        width: auto;
        display: flex;
        flex-wrap: wrap;
        margin: 30px 9vw 0 9vw;
      }
      .card {
        margin: 0 13px 22px 13px;
        max-width: unset;
        min-width: 250px;
        width: calc((100vw - 98px - 18vw - 78px) / 3);
      }
      .card:hover {
        background-color: var(--card-active);
      }
      @media (max-width: 1162px) {
        .card {
          width: calc((100vw - 98px - 18vw - 52px) / 2);
        }
      }
      @media (max-width: 825px) {
        .card {
          width: calc(100vw - 98px - 18vw - 26px);
        }
      }

      .choices {
        margin-right: auto;
        margin-left: calc(9vw + 13px);
        max-width: min(calc(100vw - 18vw - 26px - 98px), 500px);
        border-radius: 5px;
      }

      .choice:hover {
        background-color: var(--inverse-light);
      }
      .choice.choice_name:hover {
        background-color: var(--inverse-night);
      }

      .main_header {
        margin-left: calc(9vw + 13px);
        margin-right: calc(9vw + 13px);
      }
      .main_container .create_container {
        margin-right: auto;
        margin-left: calc(9vw + 13px);
      }

      .nothing_card {
        display: block;
        margin-bottom: 112px;
        margin-left: calc(9vw + 13px);
        background-color: var(--invisible);
        padding: 0;
      }
      .nothing_card:hover {
        background-color: var(--invisible);
      }

      .nothing_card .card_title {
        text-align: left;
      }
      .card_title {
        padding-top: 5px;
        padding-bottom: 6px;
        margin: 0;
        border-radius: 4px;
      }
      .drageble_img {
        display: none;
      }
      .full_token .card {
        width: 100%;
        max-width: 500px;
        margin: 0 0 15px 0;
      }

      ::-webkit-scrollbar {
        width: 4px;
        background-color: var(--scrollbar);
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: var(--scrollbar-thumb);
      }
      ::-webkit-scrollbar-thumb:active {
        background-color: var(--scrollbar-thumb-active);
      }

      @media (max-width: 950px) {
        .morda_1 {
          display:none;
          top: 70px;
          height: 48px;
        }
        .morda_1_back {
          display:none;
          height: 500px;
          width: 500px;
          transform: translate(250px, -250px);
        }
      }
      .blur_button_mobile {
        display: none;
      }
      .token_upbar {
        padding-top: 30px;
        padding-bottom: 5px;
      }


      .play_all_row {
        margin-top: -5px;
        margin-bottom: 15px;
      }
      .play_all {
        padding: 8px 13px;
      }
      .play_all_play {
        background-size: 20px;
        width: 20px;
        height: 20px;
        margin: 0px 4px 0 9px;
      }
      .play_all_pause {
        background-size: 20px;
        width: 20px;
        height: 20px;
        margin: 0px 6.5px 0 6.5px;
      }
    `
    blur_id = "blur_back"
    menu_ids.gallery = "menu_gallery_sidebar"
    menu_ids.create = "menu_create_sidebar"
    menu_ids.account = "menu_account_sidebar"

    volume_setting = true
  }
}

mobile_style_define()
