//este ficheiro é responsável por ler (o csv) e criar os elementos dos steps (textos, títulos)
export function createSteps() {

    let stepsData = "./data/steps.csv";

    return d3.csv(stepsData).then(data => {

        let container = d3.select(".steps-container");

        //evita duplicações da função createSteps
        container.html("");

        //agrupar os elementos pelo seu id
        let groupedData = d3.group(data, d => d.step_id);

        //para cada step 
        groupedData.forEach((elements, stepId) => {

            //criar a div principal
            let step = container.append("div")
                .attr("class", "step")
                .attr("data-step", stepId);

            //cria o container dos títulos
            let title = step.append("div")
                .attr("class", "step_title");

            //para cada elemento pertencente ao step/um step específico
            elements.forEach(element => {

                let newElement;

                //identifica o tipo de elemento
                switch (element.type) {

                    //se o elemento for title cria um h2
                    case "title":
                        newElement = step.append("h2")
                        break;

                    //se o elemento for date cria um h3
                    case "date":
                        newElement = step.append("h3")
                        break;

                    //se o elemento for paragraph cria um p
                    case "paragraph":
                        newElement = step.append("p")
                            .attr("class", "step_text");
                        break;

                    default:
                        console.warn("Tipo desconhecido:", element.type);
                        return;
                }

                //coloca o conteúdo
                newElement.text(element.content);

                //define a posição dos elementos na grelha
                newElement
                    .style("grid-column", element.column)
                    .style("grid-row", element.row);

                //coloca os títulos e as datas dentro de um só contentor
                //(contentor de título/subtítulo)
                if (element.type === "title" || element.type === "date") {
                    title.node().appendChild(newElement.node());
                }

            });

        });

        //devolve os dados do CSV para serem utilizados noutros ficheiros .js
        return groupedData;

    });

}
