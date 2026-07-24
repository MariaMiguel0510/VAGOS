// este ficheiro é dedicado a desenhar a legenda dos mapas do atlas
const legendTitles = {
    percentagem: "Vagos Percentagem",
    total: "Vagos Total",
    bons: "Vagos Total<br>Bom Estado",
    retencao: "Vagos Retenção",
    variacao: "Vagos Populacional"
};

//FUNÇÃO QUE DESENHA A LEGENDA -----------------------------------------------------
export function drawLegend({
    step,
    dados,
    textureScales,
    textureMapBlack,
    hiddenClasses,
    isHidden,
    onToggleClass,
    onStepUpdate
}) {

    //coloca a escala de texturas de acordo com o step atual
    let key = dados[step];
    let scale = textureScales[key];

    //devolve as texturas e os intervalos a usar
    let texture = scale.range();
    let thresholds = scale.domain();

    //seleciona o contentor onde á legenda é desenhada
    let legend = d3.select(".legend_container");

    //limpa a janela e remove os elementos anteriores
    legend.selectAll("*").remove();

    //cria um array de labels para indicar os thresholds
    let labels = [];

    //todos os valores intermédios
    for (let i = 1; i < thresholds.length; i++) {
        labels.push(
            `${thresholds[i - 1]} a ${thresholds[i]}`
        );
    }

    //escreve os títulos das legendas
    legend
        .append("h2")
        .attr("class", "legend_title")
        .html(`${legendTitles[key]} <span>(i)</span>`);


    //coloca o disclaimer (i) sobre a legenda interativa a aparecer
    legend.selectAll(".legend_title")
        .on("mouseenter", () => {
            d3.select(".legend_disclaimer")
                .style("display", "block");
        })
        .on("mouseleave", () => {
            d3.select(".legend_disclaimer")
                .style("display", "none");
        });


    //elimina o primeiro index (0) por ser < que o primeiro limite
    let legendData = texture.slice(1).map((t, i) => ({
        texture: t,
        index: i + 1
    }));


    let items = legend
        .selectAll(".legend_item")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend_item")

        .on("click", function (event, d) {
            if (onToggleClass != null) {
                onToggleClass(d.index);
            }
        });

    //blocos de textura legenda
    items
        .append("svg")
        .attr("class", "legend_texture")
        .append("rect")
        .attr("width", '2.7vh')
        .attr("height", '2.7vh')
        .attr("fill", d => textureMapBlack[d.texture].url())
        .style("opacity", d => isHidden(d.index) ? 0.6 : 1);


    //texto legenda
    items
        .append("div")
        .attr("class", "legend_label")
        .text((d, i) => labels[i]);

    const defsOrigem = [];

    d3.selectAll(".mapa_svg defs").each(function () {
        defsOrigem.push(this);
    });


    d3.selectAll(".legend_texture").each(function () {
        const svgDestino = this;

        defsOrigem.forEach(defs => {
            svgDestino.insertBefore(
                defs.cloneNode(true),
                svgDestino.firstChild
            );
        });
    });

    updateLegendVisual(legend, textureMapBlack, hiddenClasses, isHidden);
}



//FUNÇÃO QUE ATUALIZA O ASPETO DA LEGENDA -----------------------------------------
export function updateLegendVisual(
    legend,
    textureMap,
    hiddenClasses,
    isHidden
) {

    d3.selectAll(".legend_item rect")
        .attr("fill", d => textureMap[d.texture].url())
        .style("opacity", d => isHidden(d.index) ? 0.6 : 1);

    //seleciona a legenda e retira a opacidade do texto
    d3.selectAll(".legend_item")
        .style("opacity", d => {
            if (isHidden(d.index)) {
                return 0.4;
            } else {
                return 1;
            }
        });
}