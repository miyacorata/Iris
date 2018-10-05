document.addEventListener('DOMContentLoaded',() => {
    console.info("Preload script loaded.");
    let back = document.getElementsByTagName("div");
    let attribute = back[0].getAttribute('style');
    back[0].setAttribute("style",attribute + "background:#000;");
});