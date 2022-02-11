const create_location_change = () => {
  var pushState = history.pushState
  var replaceState = history.replaceState

  history.pushState = function () {
    pushState.apply(history, arguments)
    window.dispatchEvent(new Event("pushstate"))
    window.dispatchEvent(new Event("historyupdate"))
  }

  history.replaceState = function () {
    replaceState.apply(history, arguments)
    window.dispatchEvent(new Event("replacestate"))
    window.dispatchEvent(new Event("historyupdate"))
  }
}

create_location_change()
