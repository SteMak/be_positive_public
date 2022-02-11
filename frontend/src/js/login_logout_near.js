sign_in.addEventListener("click", () => {
  sign_in.classList.add("button_active")
  setTimeout(() => sign_in.classList.remove("button_active"), 200)

  if (wallet_connection != null) {
    logout_near()
    if (!account_near) login_near()
    else location.reload()
  } else {
    document.addEventListener("inited_wallet_connection", () => {
      logout_near()
      if (!account_near) login_near()
      else location.reload()
    })
  }
})

const change_account_near_action = () => {
  sign_in.style.visibility = "visible"
  // sign_in.innerHTML = account_near || "Sign in"

  sign_in.innerHTML = account_near ? "Sign out" : "Sign in"
}
account_near == null ? document.addEventListener("change_account_near", change_account_near_action) : change_account_near_action()
