/* =========================
LOADING SYSTEM
========================= */
 

// Exportação de Dados
const ADN = {
    name: "ADN Core",
    version: "3.0.1",

    // Resumo de Func (acelerar interação com importação e Exportação)
    modules: {}, // criação e armazem de nome,func
    modals: {}, // modulos registro principal
    ui: {}, // Interface
    forms: {}, // formulários dinâmicos (para Clientes)
    templates: {}, // Templates 
    func:{}, // func externas
    cache:{}, // Memory app

    // usando conceitos de nóss ou Plugs
    register(name, args = {}) {

        const type = args.type || "module";

        const module = {
            name,
            type,
            open: args.open || null,
            run: args.run || null,
            ...args
        };

        this.modules[name] = module;

        switch(type){

            case "modal":
                this.modals[name] = module;
            break;

            case "ui":
                this.ui[name] = module;
            break;

            case "form":
                this.forms[name] = module;
            break;

        }

    },

    run(name){

        const mod = this.modules[name];

        if(!mod){
            console.warn("Modulo não encontrado:", name);
            return;
        }

        if(typeof mod.open === "function"){
            mod.open();
        }

        if(typeof mod.run === "function"){
            mod.run();
        }

    }

};


const steps = [
    "Inicializando sistema...",
    "Carregando módulos...",
    "Conectando APIs...",
    "Sincronizando dados...",
    "Preparando interface...",
    "Sistema pronto"
];

const loading = document.getElementById("loading-screen");
const text = document.getElementById("loading-text");
const progress = document.getElementById("loading-progress");
const image = document.getElementById("loading-image");

const toolbar_tab = document.getElementById("toolbar-tab");

let step = 0;


/* =========================
NEXT STEP
========================= */

function nextStep(){

    if(step >= steps.length){
        finishLoading();
        return;
    }

    text.innerHTML = `
        <i class="fa-solid fa-microchip"></i>
        ${steps[step]}
    `;

    progress.style.width = ((step + 1) / steps.length) * 100 + "%";

    image.style.transform = "scale(1.08)";

    setTimeout(()=>{
        image.style.transform = "scale(1)";
    },300);

    step++;

    setTimeout(nextStep,900);

}


/* =========================
FINISH LOADING
========================= */

function finishLoading(){

    loading.classList.remove("show");
    loading.classList.add("hide");

    setTimeout(()=>{

        loading.style.display = "none";

        // MOSTRAR TOOLBAR
        if(toolbar_tab){
            toolbar_tab.classList.add("show");
        }

    },800);

}


/* =========================
START SYSTEM
========================= */

window.addEventListener("load",()=>{

    loading.classList.add("show");

    if(toolbar_tab){
        toolbar_tab.classList.remove("show");
    }

    setTimeout(()=>{
        nextStep();
    },700);

});


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

function closeModal(){

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
        alert("Preencha os campos obrigatórios.");
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

function abrirInfoServer(){
    openModal({
        title:"Central ADN Core System",
        text:"Engine carregada com sucesso",
        image:"image/fa_ADN_Loading_Mod.png",
        textsub:"Servidor Ativo"
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
                value:"ADN Core 3.0.1"
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
{ tag:"select",options:{name:"cidade_origem:", id:"cidade-origem",class:"modal-input",required:true}},

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

  const etiquetas = ADN.cache.get("etiquetas") || {};

  const id = Date.now();

  etiquetas[id] = dados;

  ADN.cache.set("etiquetas", etiquetas);

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


/* Conexões de App */ 
// Test de Registros

// type define local
// open define func

ADN.register("etiqueta", {
    open: abrirEtiqueta,
    type: "modal"
});

ADN.templates = {

    label(text){
        return { tag:"label", options:{ text } };
    },

    input(name, placeholder="", required=false){
        return {
            tag:"input",
            options:{
                name,
                type:"text",
                class:"modal-input",
                placeholder,
                required
            }
        };
    },

    textarea(name){
        return {
            tag:"textarea",
            options:{
                name,
                class:"modal-input"
            }
        };
    },

    link(url){
    return {
        tag:"a",
        options:{
            href:url,
            text:url,
            target:"_blank",
            class:"modal-link"
        }
    };
}
};

// Script.js tem que ser em ESModule ou Type:"Module" (type="module") em .json ou .html
export default ADN
