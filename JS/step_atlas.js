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
            let title_container = step.append("div")
                .attr("class", "step_title_container");

            //para cada elemento pertencente ao step/um step específico
            elements.forEach(element => {

                let newElement;

                //identifica o tipo de elemento
                switch (element.type) {
                    //--------------------------------------------------------
                    //estes três elementos são dedicados ao step 0

                    //se o elemento for heading cria um h1
                    case "heading":
                        newElement = step.append("h1")
                        break;

                    //se o elemento for subtitle cria um h2
                    case "subtitle":
                        newElement = step.append("h2")
                        break;

                    //se o elemento for intertitle cria um h3
                    case "intertitle":
                        newElement = step.append("h5")
                        break;
                    //---------------------------------------------------------

                    //se o elemento for title cria um h2
                    case "title":
                        newElement = title_container.append("h2")
                            .attr("class", "step_title");

                        // A posição do contentor vem do título
                        title_container
                            .style("grid-column", element.column)
                            .style("grid-row", element.row);
                        break;

                    //se o elemento for date cria um h3
                    case "date":
                        newElement = title_container.append("h3")
                            .attr("class", "step_subtitle");
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

                //os elementos individuais continuam a ter posições próprias,
                //exceto título e data, que pertencem ao mesmo contentor
                if (element.type !== "title" && element.type !== "date") {
                    newElement
                        .style("grid-column", element.column)
                        .style("grid-row", element.row);
                }

                //define o alinhamento vertical dentro da célula
                let verticalAlign = {
                    start: "start",
                    center: "center",
                    end: "end"
                };

                //alinha os elementos verticalmente dentro das células da grelha - coluna align
                if (verticalAlign[element.align]) {
                    newElement.style("align-self", verticalAlign[element.align]);
                }

            });

        });

        return groupedData;

    });

}
