// Menu 1......................................................

const Menu = () => {
    const menu = document.querySelector(".menu1")
    const menuBar1 = document.querySelector('.menu_bar1')
    const menuBar2 = document.querySelector('.menu_bar2')
    const menuBar3 = document.querySelector('.menu_bar3')
    const sidebar = document.querySelector(".sidebar")
    const sidebarel = document.querySelectorAll(".sidebarel")

    console.log(menu.dataset.toggle)

    if (menu.dataset.toggle === "close") {
        menu.style.backgroundColor = "rgba(0,0,0,0.75)"
        menuBar1.style.backgroundColor = "#ffffff"
        menuBar2.style.backgroundColor = "#ffffff"
        menuBar3.style.backgroundColor = "#ffffff"
        sidebarel.forEach((el,i) => {
            el.style.transition = "all 0.3s 0"
            el.style.display = "flex"
            el.style.opacity = "1"
        })
        sidebar.style.width = '26vw'
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
        sidebarel.forEach((el,i) => {
            el.style.transition = "all 0.3s 0.5s 0.5s"
            el.style.opacity = "0"
            el.style.display = "none"
        })
        sidebar.style.width = "0"
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

const HomePageAdjustment = () => {
    const menu = document.querySelector(".menu1")
    const menuBar1 = document.querySelector('.menu_bar1')
    const menuBar2 = document.querySelector('.menu_bar2')
    const menuBar3 = document.querySelector('.menu_bar3')

    if (menu.dataset.toggle === "open") {
        menu.style.backgroundColor = "transparent"
        menuBar1.style.backgroundColor = "#ffffff"
        menuBar2.style.backgroundColor = "#ffffff"
        menuBar3.style.backgroundColor = "#ffffff"
    }
    else {
        menu.style.backgroundColor = "rgba(0,0,0,0.75)"
        menuBar1.style.backgroundColor = "#ffffff"
        menuBar2.style.backgroundColor = "#ffffff"
        menuBar3.style.backgroundColor = "#ffffff"
    }
}

export {Menu, HomePageAdjustment}