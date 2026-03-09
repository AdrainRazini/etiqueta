import ADN from "./app.js";

// Função para criar o templates de html


/* S Alert */
function createAlert(args = {}) {

    if(typeof args === "string"){
        args = { text: args };
    }

    const { text = "", duration = 3000 } = args;

    const alertEl = document.createElement("div");
    alertEl.className = "custom-alert";
    alertEl.textContent = text;

    document.body.appendChild(alertEl);

    setTimeout(() => alertEl.classList.add("show"), 10);

    setTimeout(() => {
        alertEl.classList.remove("show");
        setTimeout(() => alertEl.remove(), 500);
    }, duration);
}

function createConfirm(args={}) {

    if(typeof args === "string"){
        args = { text: args };
    }

    const { text = "", onYes = null, onNo = null } = args;

    const overlay = document.createElement("div");
    overlay.className = "custom-confirm-overlay";

    const box = document.createElement("div");
    box.className = "custom-confirm-box";

    const p = document.createElement("p");
    p.textContent = text;

    const btnYes = document.createElement("button");
    btnYes.textContent = "Sim";
    btnYes.className = "confirm-btn";

    const btnNo = document.createElement("button");
    btnNo.textContent = "Não";
    btnNo.className = "cancel-btn";

    btnYes.addEventListener("click", () => {
        if(onYes) onYes();
        overlay.remove();
    });

    btnNo.addEventListener("click", () => {
        if(onNo) onNo();
        overlay.remove();
    });

    box.appendChild(p);
    box.appendChild(btnYes);
    box.appendChild(btnNo);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// Exemplo de alerta
// createAlert({ text: "Sistema carregado com sucesso!" });

// Exemplo de confirm
// createConfirm({text: "Deseja salvar as alterações?",onYes: () => console.log("Salvo!"),onNo: () => console.log("Cancelado!")});


//Loading
function createLoadingScreen(arg={}) {
    // Container principal
    const loadingScreen = createobj("div", { id: "loading-screen" });

    // Logo / imagem
    const logo = createobj("img", {
        src: "image/fa_ADN_Loading_Mod.png",
        class: "logo",
        id: "loading-image"
    });
    loadingScreen.appendChild(logo);

    // Slider / barra de progresso
    const slider = createobj("div", { class: "slider" });
    const progress = createobj("div", { class: "progress", id: "loading-progress" });
    slider.appendChild(progress);
    loadingScreen.appendChild(slider);

    // Texto de loading
    const loadingText = createobj("p", { class: "loading-text", id: "loading-text" });
    loadingText.innerHTML = '<i class="fa-solid fa-microchip"></i> Inicializando sistema...';
    loadingScreen.appendChild(loadingText);

    // Adiciona ao body
    document.body.appendChild(loadingScreen);

    return { loadingScreen, logo, progress, loadingText };
}
// Modal
function createModalTemplate(arg={}) {
    // Overlay
    const overlay = createobj("div", { id: "modal-overlay", class: "modal-overlay" });

    // Janela principal
    const modalWindow = createobj("div", { class: "modal-window" });
    overlay.appendChild(modalWindow);

    // Header
    const header = createobj("div", { class: "modal-header" });
    modalWindow.appendChild(header);

    header.appendChild(createobj("h2", { id: "modal-title", html: '<i class="fa-solid fa-circle-info"></i> Criar Etiqueta' }));

    const closeBtn = createobj("button", { id: "modal-close", class: "modal-close", html: '<i class="fa-solid fa-xmark"></i>' });
    header.appendChild(closeBtn);
    closeBtn.addEventListener("click", () => overlay.remove());

    // Body
    const body = createobj("div", { class: "modal-body", id: "modal-body" });
    modalWindow.appendChild(body);

    const text = createobj("p", { id: "modal-text" });
    body.appendChild(text);

    const image = createobj("img", { id: "modal-image", class: "modal-image", style: "display:none;" });
    body.appendChild(image);

    const inputsContainer = createobj("div", { id: "modal-inputs" });
    body.appendChild(inputsContainer);

    const textSub = createobj("p", { id: "modal-text-sub" });
    body.appendChild(textSub);

    // Footer
    const footer = createobj("div", { class: "modal-footer" });
    modalWindow.appendChild(footer);

    const btnCancel = createobj("button", { class: "btn cancel", id: "btn_cancel", text: "Cancelar" });
    footer.appendChild(btnCancel);
    btnCancel.addEventListener("click", () => overlay.remove());

    const btnConfirm = createobj("button", { class: "btn confirm", id: "btn_confirm", text: "Confirmar" });
    footer.appendChild(btnConfirm);

    // Adiciona o modal ao body
    document.body.appendChild(overlay);

    return {
        overlay,
        modalWindow,
        header,
        body,
        text,
        image,
        inputsContainer,
        textSub,
        btnCancel,
        btnConfirm,
        closeBtn
    };
}

// ToolBar
function createToolBarTemplate(arg={}){

}

//createLoadingScreen();


/* =========================
LOADING SYSTEM
========================= */

function runLoading({ steps, loadingEl, textEl, progressEl, imageEl, toolbarEl, onFinish, num}) {
    let step = 0;

    loadingEl.classList.add("show");
    if(toolbarEl) toolbarEl.classList.remove("show");

    const interval = setInterval(() => {
        if(step >= steps.length){
            clearInterval(interval);
            
            // Esconde loading
            loadingEl.classList.remove("show");
            loadingEl.classList.add("hide");

            setTimeout(()=>{
                loadingEl.style.display = "none";
                if(toolbarEl) toolbarEl.classList.add("show");
                if(onFinish) onFinish();
            }, 800);

            return;
        }

        // Atualiza texto
        textEl.innerHTML = `<i class="fa-solid fa-microchip"></i> ${steps[step]}`;

        // Atualiza progresso
        progressEl.style.width = ((step+1)/steps.length) * 100 + "%";

        // Anima imagem
        if(imageEl){
            imageEl.style.transform = "scale(1.02)";
            setTimeout(()=> imageEl.style.transform = "scale(1)", 300);
        }

        step++;
    }, num);
}



// Sistema Modal de Informação
const modal = document.getElementById("modal-overlay");
const closeBtn = document.getElementById("modal-close");

const SenderBtn = document.getElementById("btn_confirm");
const CancelBtn = document.getElementById("btn_cancel");

const titleEl = document.getElementById("modal-title");
const textEl = document.getElementById("modal-text");
const imageEl = document.getElementById("modal-image");

const inputsEl = document.getElementById("modal-inputs");

const textSubEl = document.getElementById("modal-text-sub");



/* Criação Dinamica */

let modalCallback = null;

function createobj(tag, options = {}) {

    const el = document.createElement(tag);

    Object.entries(options).forEach(([key,value])=>{

        if(key === "class"){
            el.classList.add(...value.split(" "));
        }

        else if(key === "text"){
            el.textContent = value;
        }

        else if(key === "html"){
            el.innerHTML = value;
        }

        // suporte a eventos
        else if(key.startsWith("on") && typeof value === "function"){

            const event = key.substring(2); // onclick → click
            el.addEventListener(event,value);

        }

        else if(key === "options" && tag === "select"){

            value.forEach(opt=>{

                const option = document.createElement("option");

                if(typeof opt === "string"){
                    option.value = opt;
                    option.textContent = opt;
                }else{
                    option.value = opt.value;
                    option.textContent = opt.text;
                }

                el.appendChild(option);

            });

        }

        else{
            el[key] = value;
        }

    });

    el.addEventListener("input", ()=>{
        el.classList.remove("input-error");
    });

    return el;
}


function openModal(args = {}) {

    modalCallback = args.onConfirm || null;
    

    titleEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${args.title || "Informações"}`;

    textEl.textContent = args.text || "";
    textSubEl.textContent = args.textsub || "";

    if (args.image) {
        imageEl.src = args.image;
        imageEl.style.display = "block";
    } else {
        imageEl.style.display = "none";
    }

    inputsEl.innerHTML = "";

    if(args.inputs){
        args.inputs.forEach(obj => {
            const el = createobj(obj.tag, obj.options);
            inputsEl.appendChild(el);
        });
    }

    modal.classList.add("show");

    const firstInput = inputsEl.querySelector("input, textarea, select");

    if(firstInput){
    setTimeout(()=> firstInput.focus(),100);
    }

/* 
modal.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        SenderBtn.click();
    }
});  
*/

}

function closeModal(args = {}){

    inputsEl.innerHTML = "";
    textEl.textContent = "";
    imageEl.src = "";

    modal.classList.remove("show");

}

closeBtn.addEventListener("click", closeModal);
CancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e)=>{
    if(e.target === modal){
        closeModal();
    }
});

// Pegar Dados
// Pegar Dados + Validação
function getModalData(){

    const dados = {};
    let valid = true;

    inputsEl.querySelectorAll("[name]").forEach(el => {

        let value = el.value;

        el.classList.remove("input-error");

        if(el.required && !value.trim()){
            el.classList.add("input-error");
            valid = false;
        }

        if(el.type === "number" && value !== ""){
            value = Number(value);
        }

        dados[el.name] = value;

    });

    if(!valid){
        //alert("Preencha os campos obrigatórios.");
        createAlert({ text: "Preencha os campos obrigatórios." });
        return null;
    }

    return dados;
}


// Enviar Dados
SenderBtn.addEventListener("click", ()=>{

    const dados = getModalData();

    if(!dados) return; // bloqueia envio

    if(modalCallback){
        modalCallback(dados);
    }

    closeModal();

});



// Funções
function abrirInfoServer(){

    openModal({
        title:"Central ADN Core System",
        text:"Engine carregada com sucesso",
        textsub:"Servidor Ativo",

        inputs:[

            {tag:"label", options:{text:"Arquivos"}},

            {
                tag:"button",
                options:{
                    text:"Abrir",
                    class:"btn cancel",

                    onclick:()=>{
                        createAlert("Abrindo arquivos...");
                        window.location.href = `index_pdf.html`
                    }
                }
            },

              {tag:"label", options:{text:"Servidor"}},

            {
                tag:"button",
                options:{
                    text:"Abrir",
                    class:"btn cancel",

                    onclick:()=>{
                        createAlert("Abrindo Servidor...");
                        window.location.href = `index.html`
                    }
                }
            }

        ]
    });

}

function abrirInfoInputs(){

openModal({
    title:"ADN Core",
    text:"Sistema modular carregado com sucesso.",
    textsub:"Este modal demonstra o funcionamento do sistema dinâmico de interfaces do ADN Core.",

    inputs:[

        {tag:"label", options:{text:"Módulo"}},

        {
            tag:"select",
            options:{
                name:"modulo",
                class:"modal-input",
                options:[
                    "Modal System",
                    "Cache System",
                    "Forms Engine",
                    "UI Components"
                ]
            }
        },

        {tag:"label", options:{text:"Versão da Engine"}},

        {
            tag:"input",
            options:{
                name:"versao",
                type:"text",
                class:"modal-input",
                value: ADN.name + " " + ADN.version
            }
        },

        {tag:"label", options:{text:"Tipo de Interface"}},

        {
            tag:"select",
            options:{
                name:"interface",
                class:"modal-input",
                options:[
                    "Formulário Dinâmico",
                    "Modal Informativo",
                    "Painel de Controle",
                    "Sistema de Configuração"
                ]
            }
        },

        {tag:"label", options:{text:"Descrição do Sistema"}},

        {
            tag:"textarea",
            options:{
                name:"descricao",
                class:"modal-input",
                value:"O ADN Core é uma engine modular projetada para criar interfaces, formulários e sistemas interativos de forma dinâmica utilizando configurações em JSON."
            }
        }

    ],

    onConfirm:(dados)=>{

        console.log("Configuração selecionada:", dados);

    }

});

}


function abrirConfigs(){

openModal({
    title:"Configurações",
    text:"Engine carregada com sucesso",
    textsub:"Configurações",
    inputs:[],
    //Confimação Print
    onConfirm:(dados)=>{

    console.log("Config criada:", dados);

    }
});

}

function abrirChat(){

openModal({
    title:"Chat Adn",
    text:"Engine carregada com sucesso",
    textsub:"Ia Cloud",

    inputs:[
        ADN.templates.link("https://adn-ia.vercel.app/") // Test de plug App
    ],

    onConfirm:(dados)=>{
        console.log("Chat criada:", dados);
    }

});

}

function abrirEtiqueta(){

openModal({
title:"Criar Etiqueta",
text:"Preencha os dados da etiqueta",

inputs:[

{ tag:"label", options:{text:"Nome do Cliente"} },
{ tag:"input", options:{name:"nome", type:"text", class:"modal-input",placeholder:"Digite o nome",required:true} },

{ tag:"label", options:{text:"Volume"} },
{ tag:"input", options:{name:"volume", type:"number", class:"modal-input",placeholder:"Qtd Volume",required:true} },

// Origem 
{ tag:"label", options:{text:"Origem"} },
{ tag:"input", options:{name:"origem", type:"text", class:"modal-input",placeholder:"Endereço de Origem",required:true} },
{ tag:"select",options:{name:"uf_origem", id:"uf-origem",class:"modal-input",required:true}},
{ tag:"select",options:{name:"cidade_origem", id:"cidade-origem",class:"modal-input",required:true}},

// Destino
{ tag:"label", options:{text:"Destino"} },
{ tag:"input", options:{name:"destino", type:"text", class:"modal-input",placeholder:"Endereço de Destino",required:true}},
{ tag:"select",options:{name:"uf_destino", id:"uf-destino",class:"modal-input",required:true}},
{ tag:"select",options:{name:"cidade_destino", id:"cidade-destino",class:"modal-input",required:true}},

// Extra Obs
{ tag:"label", options:{text:"Observações"} },
{ tag:"textarea", options:{name:"obs", class:"modal-input"} }

],

    //Confimação Print
    onConfirm:(dados)=>{

    createConfirm({
        text:"Deseja salvar esta etiqueta?",
        onYes:()=>{

            const etiquetas = ADN.cache.get("etiquetas") || {};

            const id = Date.now();

            etiquetas[id] = dados;

            ADN.cache.set("etiquetas", etiquetas);

            createAlert({text:"Etiqueta criada com sucesso"});
        }
    });

}


});

}

/* buttons toolbar */
const buttons = document.querySelectorAll(".toolbar button");
const infoBar = document.querySelector(".tool_info_bar");

buttons.forEach(btn => {

    const action = btn.dataset.action;
    const label = btn.dataset.label;

    btn.addEventListener("click", ()=>{

        switch(action){

            case "server":
                abrirInfoServer();
            break;

            case "chat":
                abrirChat();
            break;

            case "config":
                abrirConfigs();
            break;

            case "info":
                abrirInfoInputs();
            break;

            case "tag":
                abrirEtiqueta();
            break;

        }

    });

    btn.addEventListener("mouseenter", ()=>{
        infoBar.textContent = label;
        infoBar.classList.add("show");
    });

    btn.addEventListener("mouseleave", ()=>{
        infoBar.classList.remove("show");
    });

});


ADN.register("alert", {
    type:"ui",
    run:createAlert
});

ADN.register("confirm", {
    type:"ui",
    run:createConfirm
});

ADN.register("load", {
    type:"ui",
    run:runLoading
});

console.log(ADN);