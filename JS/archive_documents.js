/*este ficheiro é apenas para descarregar os documentos pdf da página archive*/

let reports = [
    "relatorio_estado_conservacao",
    "relatorio_patologias_construtivas",
    "relatorio_condicoes_estruturais",
    "relatorio_ocupacao_instalacoes"
];

let articles = [
    "artigo_reocupar",
    "artigo_cidade_vaga",
    "artigo_vazios_urbanos",
    "artigo_cidade_reabitada",
    "artigo_habitacao",
    "artigo_reabilitacao",
    "artigo_reabitar",
    "artigo_fogos_vagos"
];

let others = [
    "levantamento_dados"
];


function createList(containerName, items) {
    //contentor onde os documentos vão ser criados
    let container = document.querySelector(containerName);

    //para cada um dos documentos existentes
    items.forEach(item => {

        //cria um elemento lista em formato link
        let li = document.createElement("li");
        let file = document.createElement("a");

        //atribui-lhe o nome/texto do documento pdf
        let pdfPath = `./data/documents/${item}.pdf`;
        file.style.cursor = "pointer";
        file.textContent = item.replaceAll("_", " ");

        //para todos os ficheiros ao carregar num verifica se dá erro
        file.addEventListener("click", async (e) => {

            e.preventDefault();

            try {

                let response = await fetch(pdfPath, {
                    method: "HEAD"
                });

                //se o ficheiro existir descarrega-o
                if (response.ok) {
                    //abre-o numa nova tab do browser
                    window.open(pdfPath, "_blank");
                } else {
                    //não o abre
                    console.log("Ficheiro não encontrado");
                }

            } catch (error) {
                console.log("Ficheiro não encontrado");
            }
        });

        li.appendChild(file);
        container.appendChild(li);
    });
}

//cria a lista de documentos
createList(".reports", reports);
createList(".articles", articles);
createList(".others", others);