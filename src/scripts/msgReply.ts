import Cookies from "js-cookie";
import React from "react";

const deselectMsgs = () => {
  const msgs: HTMLElement = document.querySelector(".messages")!;
  msgs.childNodes.forEach((el: any, i: number) => {
    console.log();
    if (el.childElementCount > 1) {
      if (el.childNodes[1].childElementCount > 0) {
        el.childNodes[1].childNodes[0].style.backgroundColor =
          "var(--primary-light)";
      }
    } else if (el.childElementCount > 0) {
      el.childNodes[0].style.backgroundColor = "var(--primary-light)";
    }
  });
  Cookies.remove("selectedMsg", { path: "" });
  Cookies.set("replyMode", false);
};

const deselectMsg = (index: number, event: React.MouseEvent) => {
  const messages: HTMLElement = document.querySelector(".messages")!;
  let msg = messages.children[index];
  let selectedMsg = msg.children[0];
  if (msg.childElementCount > 1) {
    selectedMsg = msg.children[msg.childElementCount - 1]
      .lastChild as HTMLElement;
  }
  if ((selectedMsg as HTMLDivElement).dataset.switch === "on") {
    (selectedMsg as HTMLDivElement).dataset.switch = "off";
    (selectedMsg as HTMLDivElement).style.backgroundColor =
      "var(--primary-light)";
    Cookies.remove("selectedMsg", { path: "" });
    Cookies.set("replyMode", false);
    return true;
  }
  return false;
};

const selectMsg = (index: number, event: React.MouseEvent) => {
  const messages: HTMLElement = document.querySelector(".messages")!;
  let msg = messages.children[index];
  let selectedMsg = msg.children[0];
  if (msg.childElementCount > 1) {
    selectedMsg = msg.children[msg.childElementCount - 1]
      .lastChild as any as HTMLDivElement;
  }
  deselectMsgs();
  (selectedMsg as HTMLDivElement).style.backgroundColor =
    "var(--tertiary-light-1)";
  (selectedMsg as HTMLDivElement).dataset.switch = "on";
  console.log(selectedMsg, selectedMsg.childElementCount);
  if (selectedMsg.childElementCount > 2) {
    let id =
      (selectedMsg.children[selectedMsg.childElementCount - 2] as HTMLElement)
        .dataset.details || (selectedMsg as HTMLElement).dataset.details;
    Cookies.set("selectedMsg", id);
  } else
    Cookies.set("selectedMsg", (selectedMsg as HTMLDivElement).dataset.details);
  Cookies.set("replyMode", true);
};

export { deselectMsgs, deselectMsg, selectMsg };
