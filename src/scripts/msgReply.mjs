import Cookies from 'js-cookie'

const deselectMsgs = () => {
    const msgs = document.querySelectorAll('.chat-bubble')
    msgs.forEach((el,i) => {
        el.style.backgroundColor = "#ffffff"
        Cookies.remove("selectedMsg", {path: ''})
        Cookies.set("replyMode", false)
    })
}

const deselectMsg = (index) => {
    const msgs = document.querySelectorAll('.chat-bubble')
    let selectedMsg = msgs[index]
    if(selectedMsg.dataset.switch === 'on') {
        selectedMsg.dataset.switch = 'off'
        selectedMsg.style.backgroundColor = "#ffffff"
        Cookies.remove("selectedMsg", {path: ''})
        Cookies.set("replyMode", false)
        return true
    }
    return false
}

const selectMsg = (index) => {
    const msgs = document.querySelectorAll('.chat-bubble')
    deselectMsgs()
    msgs[index].style.backgroundColor = "#CCCCFF"
    msgs[index].dataset.switch = 'on'
    Cookies.set("replyMode", true)
    Cookies.set("selectedMsg", msgs[index].dataset.details)
}

export {deselectMsgs, deselectMsg, selectMsg}