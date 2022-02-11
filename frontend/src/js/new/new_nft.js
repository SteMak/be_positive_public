const open_new_nft_cont = (set, hash) => {
  load_new_data_by_hash(hash)

  create_button.innerHTML = `Confirm create <span class="price_value_wrap">${
    parseInt(royalty.mint_price.slice(0, royalty.mint_price.length - 18)) / 1000000
  } NEAR</span>`

  create_author_fee.innerHTML = (royalty.creator_royalty * 100) / royalty.royalty_full
  create_contract_fee.innerHTML = (royalty.my_royalty * 100) / royalty.royalty_full
  create_contract_min_fee.innerHTML = royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18) / 1000000
  create_contract_author_fee.innerHTML = ((royalty.creator_royalty + royalty.my_royalty) * 100) / royalty.royalty_full

  if (set == "create") {
    fetch(`${server}/user/${account_near}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.banned) {
          new_create.style.display = "none"
          new_finish.style.display = "none"
          new_error.style.display = "none"
          new_banned.style.display = "block"
        } else {
          new_create.style.display = "block"
          new_finish.style.display = "none"
          new_error.style.display = "none"
          new_banned.style.display = "none"
        }
      })
  } else if (set == "finish") {
    new_create.style.display = "none"
    new_finish.style.display = "block"
    new_error.style.display = "none"
    new_banned.style.display = "none"
    send_finish_new_nft_request(hash)
  } else if (set == "error") {
    new_create.style.display = "block"
    new_finish.style.display = "none"
    new_error.style.display = "block"
    new_banned.style.display = "none"
  }

  hide_warning_back()
}

const load_new_data_by_hash = async id => {
  const hash_file = (JSON.parse(window.localStorage.getItem("nft_files")) || {})[id]
  if (hash_file == undefined) {
    create_title.value = ""
    create_description.value = ""
    create_selleble.checked = true
    create_price.value = 1
    create_file_style.innerHTML = ""
    create_title.dispatchEvent(new Event("input"))
    create_selleble.dispatchEvent(new Event("change"))
    return
  }

  const name = hash_file.name
  const title = hash_file.title
  const desc = hash_file.desc
  const data = hash_file.file
  const sell = hash_file.selleble
  const price = hash_file.price

  create_title.value = title
  create_description.value = desc
  create_selleble.checked = sell
  create_price.value = price
  create_file_style.innerHTML = `
  .create_info_input::before {
    content: "${name}"
  }`
  create_title.dispatchEvent(new Event("input"))
  create_selleble.dispatchEvent(new Event("change"))
}

const send_create_new_nft_request = async () => {
  create_button.classList.add("button_active")
  setTimeout(() => create_button.classList.remove("button_active"), 200)

  let hash = ""
  let hash_got = false
  if (create_file.files[0]) {
    const form_data = new FormData()
    form_data.append("nft_file", create_file.files[0])

    await fetch(`${server}/nft_hash`, { method: "POST", body: form_data })
      .then(response => response.text())
      .then(data => {
        if (data.slice(0, 22) == "ERROR: file is too big" || (data.length != 46 && data.includes("413"))) {
          create_info_warning_bad_file.innerHTML = "File is too big, please, try with smaller file"
          create_button.classList.add("button_disabled")
          create_button.onclick = () => {}
        } else if (data.slice(0, 5) == "ERROR" || data.slice(0, 2) != "Qm" || data.length != 46) {
          create_info_warning_bad_file.innerHTML = "Unexpected error occured, please, try again later"
        } else {
          create_info_warning_bad_file.innerHTML = ""
          hash_got = true
          hash = data
        }

        hide_warning_back()
      })

    if (!hash_got) {
      return
    }

    const files = JSON.parse(window.localStorage.getItem("nft_files")) || {}
    files[hash] = {
      file: await get_base64(create_file.files[0]),
      name: create_file.files[0].name,
      title: create_title.value,
      desc: create_description.value,
      selleble: create_selleble.checked,
      price: create_price.value,
    }
    window.localStorage.setItem("nft_files", JSON.stringify(files))
  } else {
    if (location.hash.slice(0, 5) == "#scs_") {
      hash = location.hash.slice(5)
    } else if (location.hash.slice(0, 5) == "#err_") {
      hash = location.hash.slice(5)
    } else {
      hash = location.hash.slice(1)
    }

    const files = JSON.parse(window.localStorage.getItem("nft_files")) || {}
    files[hash].title = create_title.value
    files[hash].desc = create_description.value
    files[hash].selleble = create_selleble.checked
    files[hash].price = create_price.value
    window.localStorage.setItem("nft_files", JSON.stringify(files))
  }

  go_ford(hash)

  if (account_near == "") {
    logout_near()
    login_near()
  }

  const ch = create_selleble.checked
  const pr = (ch && create_price.value > 0 ? create_price.value : "").split(".")
  pr[1] = pr[1] ? pr[1].slice(0, 24) : ""
  const price = pr.join("") + "".padEnd(24 - pr[1].length, "0")

  contract.nft_create(
    {
      title: create_title.value,
      description: create_description.value,
      media: hash,
      selleble: ch,
      price,
    },
    200000000000000,
    royalty.mint_price
  )
}

const send_finish_new_nft_request = async id => {
  create_finish_button.onclick = () => {}
  create_finish_button.classList.add("button_disabled")
  finish_loading_anim.innerHTML = ""
  finish_loading_anim.classList.remove("done_loading_svg")
  finish_loading_anim.classList.remove("create_error_file")

  const files = JSON.parse(window.localStorage.getItem("nft_files")) || {}
  const hash_file = (files || {})[id] || { file: null, name: "" }
  delete files[id]
  window.localStorage.setItem("nft_files", JSON.stringify(files))

  const name = hash_file.name
  const hash = id
  const data = hash_file.file

  const form_data = new FormData()
  const file = await url_to_file(name, data)
  form_data.append("nft_file", file)

  await fetch(`${server}/nft_create/${hash}`, { method: "POST", body: form_data })
    .then(response => response.text())
    .then(data => {
      if (data.slice(0, 3) == "200") {
        create_finish_button.classList.remove("button_disabled")
        create_finish_button.onclick = () => {
          create_finish_button.classList.add("button_active")
          setTimeout(() => create_finish_button.classList.remove("button_active"), 200)
          open_account(true)
        }
        finish_loading_anim.classList.add("done_loading_svg")
        finish_loading_anim.innerHTML = "Congratulations, the NFT is minted!"
      } else {
        finish_loading_anim.classList.remove("loading_svg")
        finish_loading_anim.classList.add("create_error_file")
        finish_loading_anim.innerHTML = `
            Error happened: please reload the page and try again
            <p>${data}</p>
          `
      }
    })
}

const hide_warning_back = () => {
  if (
    (create_info_warning_empty.innerHTML == "" || create_info_warning_empty.style.display == "none") &&
    (create_info_warning_bad_file.innerHTML == "" || create_info_warning_bad_file.style.display == "none") &&
    (new_error.innerHTML == "" || new_error.style.display == "none")
  ) {
    create_back_warning.classList.add("back_warning_empty")
  } else {
    create_back_warning.classList.remove("back_warning_empty")
  }
}

const init_new_nft_event_selleble = () => {
  if (create_selleble.checked) {
    create_info_row_container_price.classList.remove("create_info_row_container_disabled")
  } else {
    create_info_row_container_price.classList.add("create_info_row_container_disabled")
  }
}
const init_new_nft_event_file = () => {
  create_file_style.innerHTML = `
    .create_info_input::before {
      content: "${create_file.files[0] ? create_file.files[0].name : "Select file"}"
    }`
}
const init_new_nft_event_button = () => {
  if (create_file.files[0] != undefined && create_file.files[0].size >= 2000000)
    create_info_warning_bad_file.innerHTML = "File is too big, please, try with smaller file"
  else create_info_warning_bad_file.innerHTML = ""

  if ((create_file.files[0] == undefined && create_file_style.innerHTML == "") || create_title.value == "") {
    create_button.classList.add("button_disabled")
    create_button.onclick = () => {}
    if (create_file.files[0] == undefined && create_file_style.innerHTML == "" && create_title.value == "")
      create_info_warning_empty.innerHTML = "Please, enter title and file to create token"
    else if (create_file.files[0] == undefined && create_file_style.innerHTML == "") create_info_warning_empty.innerHTML = "Please, enter file to create token"
    else if (create_title.value == "") create_info_warning_empty.innerHTML = "Please, enter title to create token"
  } else {
    create_button.classList.remove("button_disabled")
    create_button.onclick = send_create_new_nft_request
    create_info_warning_empty.innerHTML = ""
  }

  hide_warning_back()
}

const init_new_nft_event_button_click = () => {
  create_file.classList.add("button_active")
  setTimeout(() => create_file.classList.remove("button_active"), 200)
}

const init_new_nft_event_hash = () => {
  if (location.hash.slice(0, 5) == "#scs_") {
    open_new_nft_cont("finish", location.hash.slice(5))
  } else if (location.hash.slice(0, 5) == "#err_") {
    open_new_nft_cont("error", location.hash.slice(5))
  } else {
    open_new_nft_cont("create", location.hash.slice(1))
  }
}

const init_new_nft_events = () => {
  create_selleble.addEventListener("change", init_new_nft_event_selleble)
  create_file.addEventListener("change", init_new_nft_event_file)
  create_title.addEventListener("input", init_new_nft_event_button)
  create_file.addEventListener("input", init_new_nft_event_button)
  create_file.addEventListener("click", init_new_nft_event_button_click)
  window.addEventListener("hashchange", init_new_nft_event_hash)
}
const dest_new_nft_events = () => {
  create_selleble.removeEventListener("change", init_new_nft_event_selleble)
  create_file.removeEventListener("change", init_new_nft_event_file)
  create_title.removeEventListener("input", init_new_nft_event_button)
  create_file.removeEventListener("input", init_new_nft_event_button)
  create_file.removeEventListener("click", init_new_nft_event_button_click)
  window.removeEventListener("hashchange", init_new_nft_event_hash)
}

const init_new_nft_page = () => {
  init_new_nft_events()
  if (location.hash.slice(0, 5) == "#scs_") {
    open_new_nft_cont("finish", location.hash.slice(5))
  } else if (location.hash.slice(0, 5) == "#err_") {
    open_new_nft_cont("error", location.hash.slice(5))
  } else {
    open_new_nft_cont("create", location.hash.slice(1))
  }
}
const dest_new_nft_page = () => {
  dest_new_nft_events()
}
