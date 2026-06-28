// este ficheiro é dedicado a desenhar a tooltip dos mapas do atlas
export function createTooltip({
    dados,
    currentStep,
    path,
    m_svg,
    width,
    portugalBounds,
    textureScales,
    getClassIndex,
    isHidden
}) {

    //conjunto total da tooltip
    let tooltip = d3.select("body")
        .append("div")
        .style("position", "fixed")
        .style("pointer-events", "none")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "4px")
        .style("opacity", 0);

    //contentor geral do texto (fundo e texto em si)
    let tooltip_text_container = tooltip
        .append("div")
        .style("position", "relative")
        .style("max-width", "150px")
        .style("padding", "2px 7px 2px 7px") //top-right-bottom-left
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center");

    //background do texto para criar efeito blue/mais suave
    let tooltip_bg = tooltip_text_container
        .append("div")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("right", "0")
        .style("bottom", "0")
        .style("background", "#F7F2EA")
        .style("opacity", "0.9")
        .style("filter", "blur(7px)")
        .style("z-index", "-1");

    //texto da tooltip
    let tooltip_text = tooltip_text_container
        .append("h5")
        .style("font-family", "Crimson")
        .style("font-size", "2vh")
        .style("font-weight", "400")
        .style("word-break", "break-word")
        .style("max-width", "150px");

    //cria um svg para desenhar a linha da tooltip
    let tooltip_line = tooltip
        .append("svg")
        .attr("height", 2);

    //linha da tooltip
    tooltip_line
        .append("line")
        .attr("y1", 1)
        .attr("y2", 1)
        .attr("stroke", "black")
        .attr("stroke-width", 0.8);


    //MOUSEOVE TOOLTIP APARECER -> MOSTRA TOOLTIP
    function show(event, d) {

        let key = dados[currentStep];//obtém o valor a mostrar (percentagem/total/etc)
        let value = d.properties[key];//vai buscar o nome e o valor do município

        //escreve o texto -> nome numa linha/valor segunda linha
        tooltip_text.html(`${d.properties.local}<br>${value ?? "sem dados"}`);

        //calcula o centro do município 
        let [x, y] = path.centroid(d);
        //posição do mapa na página
        let svgRect = m_svg.node().getBoundingClientRect();

        // Retângulo que contém Portugal
        let [[minX], [maxX]] = portugalBounds;
        let centerPortugal = (minX + maxX) / 2;//deteta se o município está à esq ou drt

        let margin = 30;
        let minLine = 100;

        let lineLength;
        let left;
        let origin;

        //calcula tamanho real do contentor do texto
        let boxWidth = tooltip_text_container.node().offsetWidth;

        //se município à esquerda
        if (x < centerPortugal) {
            //distância ao lado esquerdo do mapa -> comprimento da linha
            lineLength = Math.max(minLine, x - minX + margin);

            tooltip_line.style("order", 1);
            tooltip_text_container.style("order", 0);

            left = svgRect.left + x - boxWidth - lineLength;
            origin = "right center";
        } else {
            //distância ao lado direito do mapa -> comprimento da linha
            lineLength = Math.max(minLine, maxX - x + margin);
            tooltip_line.style("order", 0);
            tooltip_text_container.style("order", 1);

            left = svgRect.left + x;
            origin = "left center";
        }

        //atualiza dinamicamente o comprimento da linha
        tooltip_line
            .attr("width", lineLength);

        tooltip_line.select("line")
            .attr("x1", 0)
            .attr("x2", lineLength);

        //centra verticalmente
        let tooltipHeight = tooltip.node().offsetHeight;

        tooltip
            .interrupt()
            .style("left", `${left}px`)
            .style("top", `${svgRect.top + y - tooltipHeight / 2}px`)
            .style("transform-origin", origin)
            .transition()
            .duration(300)
            .style("opacity", 1);
    }


    //MOUSEOVE TOOLTIP DESAPARECER -> ESCONDE TOOLTIP
    function hide() {
        tooltip
            .interrupt()
            .transition()
            .duration(200)
            .style("opacity", 0);
    }

    return { show, hide };
}