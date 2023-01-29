import Cookies from 'js-cookie'

const deselectMsgs = () => {
    const msgs = document.querySelector('.messages')
    msgs.childNodes.forEach((el,i) => {
        console.log()
        if(el.childElementCount > 1) {
            if(el.childNodes[1].childElementCount > 0) {
                el.childNodes[1].childNodes[0].style.backgroundColor = "#ffffff"
            }
        } else if(el.childElementCount > 0) {
            el.childNodes[0].style.backgroundColor = "#ffffff"
        }
    })
    Cookies.remove("selectedMsg", {path: ''})
    Cookies.set("replyMode", false)
}

const deselectMsg = (index, event) => {
    const messages = document.querySelector('.messages')
    let msg = messages.children[index]
    let selectedMsg = msg.children[0]
    if(msg.childElementCount > 1) {
        selectedMsg = msg.children[msg.childElementCount-1].lastChild
    }
    if(selectedMsg.dataset.switch === 'on') {
        selectedMsg.dataset.switch = 'off'
        selectedMsg.style.backgroundColor = "#ffffff"
        Cookies.remove("selectedMsg", {path: ''})
        Cookies.set("replyMode", false)
        return true
    }
    return false
}

const selectMsg = (index, event) => {
    const messages = document.querySelector('.messages')
    let msg = messages.children[index]
    let selectedMsg = msg.children[0]
    if(msg.childElementCount > 1) {
        selectedMsg = msg.children[msg.childElementCount-1].lastChild
    }
    deselectMsgs()
    selectedMsg.style.backgroundColor = "#CCCCFF"
    selectedMsg.dataset.switch = 'on'
    if(selectedMsg.childElementCount > 2) {
        Cookies.set("selectedMsg", selectedMsg.children[selectedMsg.childElementCount-2].dataset.details)
    }
    else Cookies.set("selectedMsg", selectedMsg.dataset.details)
    Cookies.set("replyMode", true)
}

export {deselectMsgs, deselectMsg, selectMsg}