import ADN from "./app.js";

const params = new URLSearchParams(window.location.search);

// tipo: etiquetas
// id: (múltiplos separados por vírgula)
const tipo = params.get("tipo");
const idParam = params.get("id") || ""; // "1772999205731,1773001919849"
const ids = idParam.split(",").map(s => s.trim()).filter(Boolean);

let key = {};
if(tipo){
    try {
        key = JSON.parse(localStorage.getItem(tipo)) || {};
    } catch(e){
        console.warn("Erro ao ler localStorage:", e);
    }
}

const pdf_card_container = document.getElementById("pdf-card-container");
const print_area = document.getElementById("print-area");
const bancosContainer = document.getElementById("data-center"); // container HTML
// Pega todos os tipos salvos no localStorage
const tiposDisponiveis = Object.keys(localStorage);

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

// --- Função para criar mini card (resumo) ---
function resumeCard(data, id){
    const miniCard = createobj("div", { class: "pdf-card mini" });
    miniCard.dataset.id = id;

    miniCard.appendChild(createobj("h4", { text: escapeHtml(data.nome) }));
    miniCard.appendChild(createobj("p", { text: `Volume: ${escapeHtml(data.volume)}` }));
    miniCard.appendChild(createobj("p", { text: `Origem → Destino: ${escapeHtml(data.cidade_origem)} → ${escapeHtml(data.cidade_destino)}` }));

    const btnOpen = createobj("button", { text: "Abrir", class: "modal-input btn-oculte" });
    btnOpen.addEventListener("click", () => {
        window.location.href = `index_pdf.html?tipo=etiquetas&id=${encodeURIComponent(id)}`;
    });

    miniCard.appendChild(btnOpen);
    return miniCard;
}

// --- Função para criar card completo ---
function createCard(data, id){
    const card = createobj("div", { class: "pdf-card" });
    card.dataset.id = id;

    card.appendChild(createobj("h3", { text: escapeHtml(data.nome) }));
    card.appendChild(createobj("p", { text: `Volume: ${escapeHtml(data.volume)}` }));
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
            generatePDF(card, { Qtd: data.volume });
        },

        onNo:()=>{
             ADN.run("alert",{text:"no"})
        }

    });

    });

    card.appendChild(btnPdf);
    return card;
}

// --- Função para criar mini card de banco (tipo) ---
function bancoCardItem(tipoBanco){
    const bancoCard = createobj("div", { class: "pdf-card mini" });
    bancoCard.appendChild(createobj("h4", { text: escapeHtml(tipoBanco) }));

    const btnOpen = createobj("button", { text: "Abrir", class: "modal-input btn-oculte" });
    btnOpen.addEventListener("click", () => {
        window.location.href = `index_pdf.html?tipo=${encodeURIComponent(tipoBanco)}`;
    });

    bancoCard.appendChild(btnOpen);
    return bancoCard;
}

// --- Renderização dos cards do banco selecionado ---
if(ids.length > 0){
    ids.forEach(id => {
        const data = key[id];
        if (!data) return;

        const card = createCard(data, id);
        pdf_card_container.appendChild(card);
        print_area.appendChild(card.cloneNode(true));
    });
} else if(tipo){
    Object.entries(key).forEach(([id, data]) => {
        const miniCard = resumeCard(data, id);
        pdf_card_container.appendChild(miniCard);
    });
}

// --- Renderização da lista de bancos disponíveis (apenas se não houver tipo na URL) ---
// Renderização da lista de bancos disponíveis
if(!tipo){
    if(bancosContainer){
        tiposDisponiveis.forEach(tipoBanco => {
            bancosContainer.appendChild(bancoCardItem(tipoBanco));
        });
    }else{
        ADN.run("alert",{text:"Sem dados"})
    }

}

// função para gerar PDF usando print (simples)
function generatePDF(card, options = {}) {
    const Qtd = options.Qtd || 1;
    const printContent = document.createElement("div");

    for (let i = 0; i < Qtd; i++) {
        const clone = card.cloneNode(true);

        // remove botões ocultos
        clone.querySelectorAll(".btn-oculte").forEach(el => el.remove());

        // copia valores de inputs/selects
        clone.querySelectorAll("input, select, textarea").forEach(el => {
            if(el.name){
             const original = card.querySelector(`[name="${el.name}"]`);
             if(original) el.value = original.value;
            }
        });

        printContent.appendChild(clone);
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>PDF</title>');
    printWindow.document.write('<link rel="stylesheet" href="css/layout_pdf.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}