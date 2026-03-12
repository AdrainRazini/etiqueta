import ADN from "./app.js";

let prefix = "etiquetas"

function getStorage(key){
    try{
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    }catch(e){
        console.warn("Erro ao ler localStorage:",e);
        return {};
    }
}

function ensureStorage(key){

    let data = getStorage(key);

    // se não existir cria banco vazio
    if(!localStorage.getItem(key)){

        localStorage.setItem(key, JSON.stringify({}));
        data = {};

    }

    return data;

}

const params = new URLSearchParams(window.location.search);

// tipo:etiquetas id:(múltiplos separados por vírgula)
const tipo = params.get("tipo");
const idParam = params.get("id") || ""; 
const ids = idParam.split(",").map(s => s.trim()).filter(Boolean);

let key = {};
if(tipo){
    //key = getStorage(tipo);
    key = ensureStorage(tipo);
}


// Pega filtrado no localStorage
const tiposDisponiveis = Object.keys(localStorage)
.filter(key => key.startsWith(prefix));


const pdf_card_container = document.getElementById("pdf-card-container");
const print_area = document.getElementById("print-area");
const bancosContainer = document.getElementById("data-center"); // container HTML


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

// função para escapar HTML (segurança)
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function filter(data = {}, id){

    const etiquetaData = {
        ID: id,
        Nome: data.nome,
        Produto:"Etiqueta",
        Qtd: data.volume,
        Origem: `${data.cidade_origem} - ${data.uf_origem}`,
        Destino: `${data.cidade_destino} - ${data.uf_destino}`,
        Logo: "image/Logo_Transcotempo_black.png",
        Imagem: "image/Logo_Transcotempo_black.png"
    };

    return etiquetaData;

}

// --- Função para criar mini card (resumo) ---
function resumeCard(data, id){
    const miniCard = createobj("div", { class: "pdf-card mini" });
    miniCard.dataset.id = id;

    miniCard.appendChild(createobj("h4", { text: escapeHtml(data.nome) }));
    miniCard.appendChild(createobj("p", { text: `Volume: ${escapeHtml(data.volume)}` }));
    miniCard.appendChild(createobj("p", { text: `Origem: ${escapeHtml(data.cidade_origem)} - ${escapeHtml(data.uf_origem)}` }));
    miniCard.appendChild(createobj("p", { text: `Destino: ${escapeHtml(data.cidade_destino)} - ${escapeHtml(data.uf_destino)}` }));
    const btnOpen = createobj("button", { text: "Abrir", class: "modal-input btn-oculte" });
    btnOpen.addEventListener("click", () => {
        window.location.href = `index_pdf.html?tipo=etiquetas&id=${encodeURIComponent(id)}`;
    });

  const btnDelete = createobj("button", { text: "Excluir", class: "modal-input btn-oculte"});
  btnDelete.addEventListener("click",()=>{
  ADN.run("confirm",{
        text:"Deseja excluir este registro?",

        onYes:()=>{
            delete key[id];
            localStorage.setItem(tipo, JSON.stringify(key));
            miniCard.remove();
        }
    });

});
    miniCard.appendChild(btnOpen);
    miniCard.appendChild(btnDelete);
    return miniCard;
}

// --- Função para criar card completo ---
function createCard(data, id){
    const card = createobj("div", { class: "pdf-card" });
    card.dataset.id = id;

    card.appendChild(createobj("h3", { text: escapeHtml(data.nome) }));
    card.appendChild(createobj("p", { text: `Volume: ${escapeHtml(data.volume)}`, class: "qtd-volume"  }));
    card.appendChild(createobj("p", { text: `Origem: ${escapeHtml(data.cidade_origem)} - ${escapeHtml(data.uf_origem)}` }));
    card.appendChild(createobj("p", { text: `Destino: ${escapeHtml(data.cidade_destino)} - ${escapeHtml(data.uf_destino)}` }));
    card.appendChild(createobj("p", { text: `Obs: ${escapeHtml(data.obs || '-')}` }));

    const btnPdf = createobj("button", { 
    text: "Gerar PDF", 
    class: "modal-input btn-oculte" 
    });

    btnPdf.addEventListener("click", () => {

    ADN.run("confirm",{
        text:"Deseja imprimir todas as etiquetas deste volume?",

onYes:()=>{

    // ADN.run("filter",{data, id});
    const etiquetaData = filter(data, id);
    generatePDFData(etiquetaData);

       },

        onNo:()=>{
            // ADN.run("alert",{text:"no"})
        }

    });

    });

    const btnEdite =  createobj("button", { 
    text: "Editar", 
    class: "modal-input btn-oculte" 
    });

    btnEdite.addEventListener("click", () => {

    ADN.run("confirm",{
        text:"Deseja editar a etiqueta deste volume?",
       onYes:()=>{
        ADN.run("abrirEtiqueta",{id,data})
       },
        onNo:()=>{
        //ADN.run("alert",{text:"no"})
        }

    });

    });


    card.appendChild(btnEdite);
    card.appendChild(btnPdf);
    return card;
}

// --- Função para criar mini card de banco (tipo) ---
function bancoCardItem(tipoBanco){

    const bancoCard = createobj("div",{class:"banco-card"});

    const header = createobj("div",{class:"banco-header"});

    const icon = createobj("i",{class:"fa-solid fa-box"});
    const title = createobj("h4",{text:escapeHtml(tipoBanco)});

    header.append(icon,title);

    const btnOpen = createobj("button",{ 
        text:"Abrir",
        class:"btn-open"
    });

    btnOpen.onclick = ()=>{
        window.location.href =
        `index_pdf.html?tipo=${encodeURIComponent(tipoBanco)}`;
    };

    bancoCard.append(header,btnOpen);

    return bancoCard;

}

/* Render */
function clearRender(){

    if(pdf_card_container){
        pdf_card_container.innerHTML = "";
    }

    if(print_area){
        print_area.innerHTML = "";
    }

    if(bancosContainer){
        bancosContainer.innerHTML = "";
    }

}


/* Render principal */

function render(){

    clearRender();

    if(ids.length > 0){

        renderCardsPorID();

    }else if(tipo){

        renderCardsResumo();

    }else{

        renderBancos();

    }

}


/* Monitor de mudanças */

function monitorRender(){

    let cache = JSON.stringify(key);

    setInterval(()=>{

        const atual = localStorage.getItem(tipo);

        if(!atual) return;

        if(atual !== cache){

            cache = atual;
            key = JSON.parse(atual);

            render();

        }

    }, 500); // verifica a cada 0.5s

}


/* Renderização por ID */
function renderCardsPorID(){

    ids.forEach(id => {

        const data = key[id];
        if(!data) return;

        const card = createCard(data, id);

        pdf_card_container.appendChild(card);
        print_area.appendChild(card.cloneNode(true));

    });

}


/* Renderização resumo */
function renderCardsResumo(){

    Object.entries(key).forEach(([id, data]) => {

        const miniCard = resumeCard(data, id);
        pdf_card_container.appendChild(miniCard);

    });

}


/* Renderização dos bancos */
function renderBancos(){

    if(!bancosContainer){
        ADN.run("alert",{text:"Container não encontrado"});
        return;
    }

    if(tiposDisponiveis.length === 0){
        ADN.run("alert",{text:"Sem dados"});
        return;
    }

    tiposDisponiveis.forEach(tipoBanco=>{
        bancosContainer.appendChild(bancoCardItem(tipoBanco));
    });

}


/* Inicialização */
monitorRender();
render();


// função para gerar PDF usando print (simples)
function TemplateEtiqueta(Data = {}, volume = 1){

    const table = createobj("table",{class:"etiqueta"});

    // HEADER
    const headerRow = createobj("tr");
    const headerCell = createobj("td",{colSpan:3});

    const header = createobj("div",{class:"header"});

    const logo = createobj("img",{
        class:"logo",
        src: Data.Logo || ""
    });

    const titulo = createobj("div",{
        class:"titulo",
        text:"ETIQUETA DE IDENTIFICAÇÃO"
    });

    header.append(logo,titulo);
    headerCell.appendChild(header);
    headerRow.appendChild(headerCell);

    // ROW PRODUTO
    const row1 = createobj("tr");

    const imgCell = createobj("td",{
        rowSpan:4
    });

    imgCell.style.width = "140px";
    imgCell.style.textAlign = "center";

    const img = createobj("img",{
        class:"imagem-produto",
        src: Data.Imagem || ""
    });

    imgCell.appendChild(img);

    const idTitle = createobj("td",{html:"<strong>Nome:</strong>"});
    const idValue = createobj("td",{text:Data.Nome || ""});

    row1.append(imgCell,idTitle,idValue);


        // VOLUME
    const row2 = createobj("tr");
    row2.append(
        createobj("td",{html:"<strong>Volume</strong>"}),
        createobj("td",{text:`${volume} / ${Data.Qtd || 1}`})
    );

    // Origem
    const row3 = createobj("tr");
    row3.append(
        createobj("td",{html:"<strong>Origem</strong>"}),
        createobj("td",{text:Data.Origem || ""})
    );

    // DESTINO
    const row4 = createobj("tr");
    row4.append(
        createobj("td",{html:"<strong>Destino</strong>"}),
        createobj("td",{text:Data.Destino || ""})
    );

    // CODIGO
    const row5 = createobj("tr");
    const code = createobj("td",{
        colSpan:3,
        class:"codigo",
        text:`#${Data.ID || ""}`
    });

    row5.appendChild(code);

    table.append(headerRow,row1,row2,row3,row4,row5);

    return table;
}


function generatePDFData(Data = {}) {

    const totalVolumes = Number(Data.Qtd) || 1;
    const grid = createobj("div",{class:"grid"});

    for(let i=1;i<=totalVolumes;i++){
        grid.appendChild(TemplateEtiqueta(Data,i));
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    const pdfId = Data.ID
    const cssUrl = "css/transporte/style.css";

    printWindow.document.write(`
        <html>
        <head>
            <title>PDF_${pdfId}</title>
            <link rel="stylesheet" href="${cssUrl}">
        </head>
        <body></body>
        </html>
    `);

    printWindow.document.close();

    const waitLoad = () => {

        const images = printWindow.document.images;

        let loaded = 0;

        if(images.length === 0){
            startPrint();
            return;
        }

        for(let img of images){

            if(img.complete){
                loaded++;
            }else{
                img.onload = img.onerror = () => {
                    loaded++;
                    if(loaded === images.length){
                        startPrint();
                    }
                };
            }

        }

        if(loaded === images.length){
            startPrint();
        }

    };

    const startPrint = () => {

        setTimeout(()=>{
            printWindow.print();
        },200);

    };

    // adiciona conteúdo
    printWindow.document.body.appendChild(grid);

    // espera renderização
    setTimeout(waitLoad,100);

}

function generatePDFcard(card, options = {}) {
  
    const totalVolumes = Number(options.Qtd) || 1;
    const printContent = document.createElement("div");

    for (let i = 1; i <= totalVolumes; i++) {

        const clone = card.cloneNode(true);

        clone.querySelectorAll(".btn-oculte").forEach(el => el.remove());

        const volumeEl = clone.querySelector(".qtd-volume");

        if(volumeEl){
            volumeEl.textContent = `Volume ${i}/${totalVolumes}`;
        }

        printContent.appendChild(clone);

    }
    const printWindow = window.open('', '', 'width=800,height=600');
    if(!printWindow){
    //alert("Popup bloqueado pelo navegador.");
    ADN.run("alert",{text:"Popup bloqueado pelo navegador."})
    return;
    }
    printWindow.document.write('<html><head><title>PDF</title>');
    printWindow.document.write('<link rel="stylesheet" href="css/transporte/style.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
   
    // espera tudo carregar
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
        }, 200);
    };
}


ADN.register("filter", {
    type:"ui",
    run:filter
});

ADN.register("generatePDFData", {
    type:"ui",
    run:generatePDFData
});