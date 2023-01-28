import Cookies from 'js-cookie'

const deselectMsgs = () => {
    const msgs = document.querySelector('.messages')
    msgs.childNodes.forEach((el,i) => {
        if(el.childNodes.length > 0) {
            el.childNodes[0].style.backgroundColor = "#ffffff"
            if(el.childNodes[0].childNodes.length === 2) {
                el.childNodes[0].childNodes[1].style.backgroundColor = "#ffffff"
            }
        }
        Cookies.remove("selectedMsg", {path: ''})
        Cookies.set("replyMode", false)
    })
}

const deselectMsg = (index, event) => {
    const messages = document.querySelector('.messages')
    let selectedMsg = messages.children[index].children[0]
    if(selectedMsg.dataset.switch === 'on') {
        selectedMsg.dataset.switch = 'off'
        selectedMsg.style.backgroundColor = "#ffffff"
        if(selectedMsg.children.length === 2) {
            selectedMsg.children[1].style.backgroundColor = "#ffffff"
        }
        Cookies.remove("selectedMsg", {path: ''})
        Cookies.set("replyMode", false)
        return true
    }
    return false
}

const selectMsg = (index, event) => {
    const messages = document.querySelector('.messages')
    let selectedMsg = messages.children[index].children[0]
    deselectMsgs()
    selectedMsg.style.backgroundColor = "#CCCCFF"
    selectedMsg.dataset.switch = 'on'
    if(selectedMsg.children.length === 2) {
        Cookies.set("selectedMsg", selectedMsg.children[1].dataset.details)
        selectedMsg.children[1].style.backgroundColor = "#CCCCFF"
    }
    else Cookies.set("selectedMsg", selectedMsg.dataset.details)
    Cookies.set("replyMode", true)
}

export {deselectMsgs, deselectMsg, selectMsg}