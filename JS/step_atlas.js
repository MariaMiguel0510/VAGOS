//este ficheiro é responsável por ler (o csv) e criar os elementos dos steps (textos, títulos)

//lê os dados do csv, agrupa-os por steps e cria os elementos do HTML
export function createSteps() {

    let stepsData = "./data/steps.csv";

    return d3.csv(stepsData).then(data => {

        let container = d3.select(".steps-container");

        //evita duplicações da função createSteps
        container.html("");

        //agrupar os elementos pelo seu id
        let groupedData = d3.group(data, d => d.step_id);

        //cria uma variável/objeto para guardar os blocos anteriores
        //para podermos comparar o conteúdo com o step seguinte
        let previousBlocks = {};

        //percorre cada step e cria o respetivo contentor
        groupedData.forEach((elements, stepId) => {

            let step = container.append("div")
                .attr("class", "step")
                .attr("data-step", stepId);

            //o título do step (se existir) é necessário para posicionar a data
            let titleElement = elements.find(e => e.type === "title");

            //conta quantos objetos de cada tipo foram encontrados no step atual
            let counters = {};
            //guarda os blocos que pertencem ao step atual 
            //e que poderão ser comparados com os elementos do step seguinte
            let currentBlocks = {};

            //verifica se cada elemento já existia no step anterior
            elements.forEach(element => {

                //se já existir um contador para aquele elemento, utiliza o seu valor
                //caso contrário, começa em zero e depois, adiciona 1
                counters[element.type] = (counters[element.type] || 0) + 1;

                //cria uma "chave" que identifica o elemento
                //se um step tiver 3 parágrafos permite saber qual deles
                let key = element.type + "#" + counters[element.type];

                //cria uma string com as especificações de cada elemento
                let signature = [
                    element.type,
                    element.content,
                    element.column,
                    element.row,
                    element.align
                ].join("|");

                //a data é desenhada por baixo do título, por isso a sua posição
                //depende dele: se o título mudar de texto/posição, a data é recriada
                if (element.type === "date" && titleElement) {
                    signature += "||" + [
                        titleElement.content,
                        titleElement.column,
                        titleElement.row
                    ].join("|");
                }

                //comparar o elemento com o dod step anterior
                let prev = previousBlocks[key];

                //verifica se o elemento continua igual 
                //e se as suas características são iguais às do bloco anterior
                if (prev && prev.signature === signature) {
                    //se o bloco for igual/o mesmo
                    prev.span += 1;//adiciona um step à duração do elemento
                    prev.pin.style("height", (prev.span * 100) + "vh");//atualiza a altura do bloco
                    currentBlocks[key] = prev;//guarda o bloco no step atual
                    return;
                }

                //quando o elemento muda cria um novo bloco
                let pin = step.append("div").attr("class", "step_pin");
                let inner = pin.append("div").attr("class", "step_pin_inner");

                buildElement(inner, element, titleElement);

                //guarda as informações do novo bloco para depois este ser comparado
                currentBlocks[key] = { signature, span: 1, pin };
            });

            //quem não aparece neste step deixa de ser comparado com o próximo
            previousBlocks = currentBlocks;
        });

        return groupedData;
    });
}


//cria cada elemento individual e aplica-lhe a respetiva posição e alinhamento
//contentor onde o elemento é criado, info do csv, informação do título
function buildElement(inner, element, titleElement) {

    //possíveis alinhamentos dos elementos
    let vertical_align = { start: "start", center: "center", end: "end" };

    let newElement;

    //identifica o tipo de elemento
    switch (element.type) {
        case "heading":
            newElement = inner.append("h1");
            break;

        case "subtitle":
            newElement = inner.append("h2");
            break;

        case "intertitle":
            newElement = inner.append("h5");
            break;

        case "title": {
            let title_container = inner.append("div")
                .attr("class", "step_title_container")
                .style("grid-column", element.column)
                .style("grid-row", element.row);

            newElement = title_container.append("h2")
                .attr("class", "step_title");
            break;
        }

        case "date": {
            //a posição vem do título (como antes); se não houver título, usa a da data
            let pos = titleElement || element;

            let title_container = inner.append("div")
                .attr("class", "step_title_container")
                .style("grid-column", pos.column)
                .style("grid-row", pos.row);

            //cópia invisível do título só para reservar o espaço dele,
            //assim a data fica exatamente por baixo do título real
            if (titleElement) {
                title_container.append("h2")
                    .attr("class", "step_title")
                    .attr("aria-hidden", "true")
                    .style("visibility", "hidden")
                    .text(titleElement.content);
            }

            newElement = title_container.append("h3")
                .attr("class", "step_subtitle");
            break;
        }

        case "paragraph":
            newElement = inner.append("p")
                .attr("class", "step_text");
            break;

        default:
            console.warn("Tipo desconhecido:", element.type);
            return;
    }

    newElement.text(element.content);

    //título e data não são posicionados diretamente: a posição está no contentor
    if (element.type !== "title" && element.type !== "date") {
        newElement
            .style("grid-column", element.column)
            .style("grid-row", element.row);
    }

    //atribui o alinhamento de cada elemento
    if (vertical_align[element.align]) {
        newElement.style("align-self", vertical_align[element.align]);
    }
}