function addValueInLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}
function getValueFromLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key))
}
function deleteValueFromLocalStorage(key) {
    window.localStorage.removeItem(key)
}

export { addValueInLocalStorage, getValueFromLocalStorage ,deleteValueFromLocalStorage };