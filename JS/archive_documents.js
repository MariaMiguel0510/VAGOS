/*este ficheiro é apenas para descarregar os documentos pdf da página archive*/
let archiveData = "./data/archive.csv";

function createList(link) {


    d3.csv(link).then(d => {
        let item, name, containerName;

        //para cada um dos documentos existentes
        d.forEach(datum => {
            item = datum.file;
            name = datum.name;
            containerName = datum.type;

            //cria um elemento lista em formato link
            let li = document.createElement("li");
            let file = document.createElement("a");

            //atribui-lhe o nome/texto do documento pdf
            let pdfPath = `./data/documents/${item}.pdf`;
            file.style.cursor = "pointer";
            file.textContent = name;

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
            document.querySelector(containerName).appendChild(li);
        });
    });

    d3.csv(link).then(d => {
    console.log(d[0]);
});
}

//cria a lista de documentos
createList(archiveData);