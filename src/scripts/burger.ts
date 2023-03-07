// Menu 1......................................................

const Menu = () => {
  const menu: HTMLElement = document.querySelector(".menu1")!;
  const menuBar1: HTMLElement = document.querySelector(".menu_bar1")!;
  const menuBar2: HTMLElement = document.querySelector(".menu_bar2")!;
  const menuBar3: HTMLElement = document.querySelector(".menu_bar3")!;
  const sidebar: HTMLElement = document.querySelector(".burgerSidebar")!;

  if (menu.dataset.toggle === "close") {
    menu.style.backgroundColor = "var(--primary)";
    menuBar1.style.backgroundColor = "var(--primary-light)";
    menuBar2.style.backgroundColor = "var(--primary-light)";
    menuBar3.style.backgroundColor = "var(--primary-light)";
    sidebar.style.width = "17.5rem";
    sidebar.style.padding = "0 20px";
    sidebar.style.paddingTop = "3rem";
    sidebar.childNodes.forEach((node: any) => {
      node.style.display = "block";
    });
    setTimeout(() => {
      sidebar.childNodes.forEach((node: any) => {
        node.style.opacity = "1";
      });
    }, 300);
    menuBar1.style.width = "100%";
    menuBar1.style.transform = "translate(-66%, -11.5px) rotate(-45deg)";
    menuBar2.style.width = "0";
    menuBar3.style.width = "100%";
    menuBar3.style.transform = "translate(-35%, -12.5px) rotate(45deg)";
  } else {
    menu.style.backgroundColor = "transparent";
    menuBar1.style.backgroundColor = "var(--primary-light)";
    menuBar2.style.backgroundColor = "var(--primary-light)";
    menuBar3.style.backgroundColor = "var(--primary-light)";
    sidebar.childNodes.forEach((node: any) => {
      node.style.transition = "all 0.3s";
      node.style.opacity = "0";
    });
    setTimeout(() => {
      sidebar.style.width = "0";
      sidebar.style.padding = "0";
      sidebar.style.paddingTop = "0rem";
      sidebar.childNodes.forEach((node: any) => {
        node.style.display = "none";
      });
    }, 500);
    menuBar1.style.width = "50%";
    menuBar1.style.transform = "translate(-100%, -11.5px)";
    menuBar1.style.transformOrigin = "100% 0";
    menuBar2.style.width = "100%";
    menuBar2.style.transform = "translate(-50%, 0.4px)";
    menuBar3.style.width = "50%";
    menuBar3.style.transform = "translate(0, 11.5px)";
    menuBar3.style.transformOrigin = "0 100%";
  }
};

export { Menu };
