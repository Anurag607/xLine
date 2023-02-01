// Menu 1......................................................

const Menu = () => {
    const menu = document.querySelector(".menu1")
    const menuBar1 = document.querySelector('.menu_bar1')
    const menuBar2 = document.querySelector('.menu_bar2')
    const menuBar3 = document.querySelector('.menu_bar3')
    const sidebar = document.querySelector(".sidebar")
    const chatRooms = document.querySelector(".bg-chatRooms")
    const seeUserBtn = document.querySelector(".seeUserButton")
    const chatRoomsChildren = document.querySelectorAll(".bg-chatRooms div")

    if (menu.dataset.toggle === "close") {
        menu.style.backgroundColor = "#f65275"
        menuBar1.style.backgroundColor = "#ffffff"
        menuBar2.style.backgroundColor = "#ffffff"
        menuBar3.style.backgroundColor = "#ffffff"
        sidebar.style.width = '17.5rem'
        chatRooms.style.display = "flex"
        setTimeout(() => {
            chatRooms.style.width = '17.5rem'
        }, 150)
        setTimeout(() => {
            chatRoomsChildren.forEach((el,i) => {
                el.style.opacity = 1
            })
            seeUserBtn.style.opacity = 1
        }, 500)
        menuBar1.style.width = '100%'
        menuBar1.style.transform = 'translate(-66%, -11.5px) rotate(-45deg)'
        menuBar2.style.width = 0
        menuBar3.style.width = '100%'
        menuBar3.style.transform = 'translate(-35%, -12.5px) rotate(45deg)'
    }
    else {
        menu.style.backgroundColor = "transparent"
        menuBar1.style.backgroundColor = "#ffffff"
        menuBar2.style.backgroundColor = "#ffffff"
        menuBar3.style.backgroundColor = "#ffffff"
        seeUserBtn.style.opacity = 0
        chatRoomsChildren.forEach((el,i) => {
            el.style.opacity = 0
        })
        setTimeout(() => {
            chatRooms.style.width = '0'
        }, 300)
        setTimeout(() => {
            chatRooms.style.display = "none"
            sidebar.style.width = "0"
        }, 500)
        menuBar1.style.width = '50%'
        menuBar1.style.transform = 'translate(-100%, -11.5px)'
        menuBar1.style.transformOrigin = '100% 0'
        menuBar2.style.width = '100%'
        menuBar2.style.transform = 'translate(-50%, 0.4px)'
        menuBar3.style.width = '50%'
        menuBar3.style.transform = 'translate(0, 11.5px)'
        menuBar3.style.transformOrigin = '0 100%'
    }
}

export {Menu}