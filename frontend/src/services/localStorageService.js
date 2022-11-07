function addValueInLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}
function getValueFromLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key))
}

export { addValueInLocalStorage, getValueFromLocalStorage };