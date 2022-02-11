const copy_to_clipboard = text => {
  var temp = document.createElement("input")
  document.getElementsByTagName("body")[0].append(temp)
  temp.value = text
  temp.select()
  document.execCommand("copy")
  temp.remove()
}

const get_base64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const url_to_file = (filename, url) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => new File([buf], filename))
}
