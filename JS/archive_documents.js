/*este ficheiro é apenas para descarregar os documentos pdf da página archive*/

let archiveData = "./data/archive.csv";

function createList(link) {

    d3.csv(link).then(data => {

        //para cada um dos documentos existentes
        data.forEach(datum => {

            let item = datum.file;
            let name = datum.name;
            let containerName = datum.type;

            //caminho para encontrar o pdf
            let pdfPath = `./data/documents/${item}.pdf`;

            //cria um elemento lista em formato link
            let li = document.createElement("li");
            let file = document.createElement("a");

            //atribui-lhe o nome/texto do documento pdf
            file.href = pdfPath;
            file.target = "_blank";
            file.textContent = name;

            //adiciona à lista 
            li.appendChild(file);

            document
                .querySelector(containerName)
                .appendChild(li);
        });

    }).catch(error => {
        console.log("Ficheiro não encontrado");
    });
}

//cria a lista de documentos
createList(archiveData);