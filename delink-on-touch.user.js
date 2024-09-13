// ==UserScript==
// @name Delink on Touch
// @version 0.1.0
// @description Stop showing context menu when long-pressing a link, enable text selection.
// @homepageURL https://github.com/eight04/delink-on-touch
// @supportURL https://github.com/eight04/delink-on-touch/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @namespace https://github.com/eight04
// @match *://*/*
// @grant GM_registerMenuCommand
// ==/UserScript==

/* global GM_registerMenuCommand */

let id;

register();

function register() {
  id = GM_registerMenuCommand("Enable", init, {id});
}

function init() {
  const links = new Map();
  GM_registerMenuCommand("Disable", uninit, {id});

  document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchend", onTouchEnd);

  let timeoutId;

  function onTouchStart(e) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const a = e.target.closest("a");
      if (a && a.getAttribute("href")) {
        links.set(a, a.href);
        a.href = "";
      }
    }, 150);
  }

  function onTouchEnd() {
    clearTimeout(timeoutId)
    for (const [a, href] of links) {
      a.href = href;
    }
    links.clear();
  }

  function uninit() {
    register();
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd)
  }
}
