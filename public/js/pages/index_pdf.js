//pages/index_pdf.js
import "../core/main.js"
import "../core/render.js"

import ADN from "../core/app.js";

 ADN.run("load",{
    steps:["Sistema pronto"],
    loadingEl: document.getElementById("loading-screen"),
    textEl: document.getElementById("loading-text"),
    progressEl: document.getElementById("loading-progress"),
    imageEl: document.getElementById("loading-image"),
    toolbarEl: document.getElementById("toolbar-tab"),
    onFinish: ()=> console.log("Sistema carregado!"),
    num: 100})