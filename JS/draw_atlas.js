// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
let m_svg = null; //guarda o mapa
let mapa = null; //guarda todos os path dos concelhos

let colorScales = {};
const dados = ["percentagem", "total", "bons", "retencao", "variacao", "local"];
const legendTitles = {
    percentagem: "Vagos Percentagem",
    total: "Vagos Total",
    bons: "Vagos Total Bom Estado",
    retencao: "Vagos Retenção",
    variacao: "Vagos Populacional"
};

let currentStep = 0;
let hiddenClasses = new Set();


let tooltip = d3.select("body")
    .append("div")
    .style("position", "fixed")
    .style("pointer-events", "none")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "4px")
    .style("opacity", 0);

let tooltip_text = tooltip
    .append("h5")
    .style("font-family", "Crimson")
    .style("margin", "0")
    .style("font-size", "2vh")
    .style("font-weight", "400")
    .style("word-break", "break-word")
    .style("max-width", "150px");

let tooltip_line = tooltip
    .append("div")
    .style("height", "0px")
    .style("flex", "1")
    .style("border-top", "1.2px solid black");


// verifica se está escondido
function isHidden(index) {
    return hiddenClasses.has(index);
}


// classifica corretamente com base nos thresholds
function getClassIndex(scale, value) {
    let thresholds = scale.domain();

    for (let i = 0; i < thresholds.length; i++) {
        if (value <= thresholds[i]) return i;
    }

    return thresholds.length;
}


//FUNÇÃO QUE DESENHA O MAPA -----------------------------------------------------------------
export function draw_map(geojson, csvData) {

    //transforma o array do CSV num Map para procurar os id por índices e ser mais rápido
    let csvMap = new Map(csvData.map(d => [d.id, d]));
    setColorScales();

    //junta os dados do geojson com os do csv
    geojson.features.forEach(feature => {

        //procura a correspondência entre o geojson e o csv
        let match = csvMap.get(+feature.properties.DICO);

        if (match) {
            dados.forEach(dado => feature.properties[dado] = match[dado]);
        }
    });

    //seleciona o contentor onde o mapa vai ser desenhado
    let container = d3.select(".draw_atlas");
    //evita criar vários mapas 
    container.selectAll("m_svg").remove();

    //cria o svg
    m_svg = container
        .append("svg")
        .attr("class", "mapa_svg");

    //determina as medidas da largura da janela 
    //para que a largura do mapa seja responsiva
    let width = container.node().clientWidth;
    let height = container.node().clientHeight;

    m_svg.attr("viewBox", `0 0 ${width} ${height}`);

    let projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    let path = d3.geoPath().projection(projection);


    //desenha o mapa
    mapa = m_svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)

        .attr("fill", d => {
            let key = dados[0];
            let scale = colorScales[key];
            let value = d.properties[key];

            if (value == null || isNaN(value)) return "#999";

            let classIndex = getClassIndex(scale, value);
            if (isHidden(classIndex)) {
                return "#ffffff";
            } else {
                return scale(value);
            }
        })

        .attr("stroke", "#F7F2EA")
        .attr("stroke-width", 0.35)


        //TOOLTIP A APARECE -------------------------------
        .on("mouseover", function (event, d) {

            d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", 1)
                .attr("fill", "#FFD700")
                .style("cursor", "pointer");


            //escreve o nome dos concelhos
            let key = dados[currentStep];
            let value = d.properties[key];

            tooltip_text.html(`
        ${d.properties.local} <br>
        ${value ?? "sem dados"}
    `);


            let [x, y] = path.centroid(d);
            let svgRect = m_svg.node().getBoundingClientRect();

            let mapMiddle = width / 2;
            let left;
            let origin;

            //a linha do lado esquerdo é maior que a do lado direito
            if (x < mapMiddle) {
                tooltip.style("width", "150px");
                let tooltipWidth = 150;
                tooltip_line.style("order", 1);
                tooltip_text.style("order", 0);
                left = svgRect.left + x - tooltipWidth;
                origin = "right center";
            } else {
                tooltip.style("max-width", "150px");
                let tooltipWidth = 150;
                tooltip_line.style("order", 0);
                tooltip_text.style("order", 1);
                left = svgRect.left + x;
                origin = "left center";
            }

            tooltip
                .interrupt()
                .style("left", `${left}px`)
                .style("top", `${svgRect.top + y}px`)
                .style("transform-origin", origin)

                .transition()
                .duration(300)
                .style("opacity", 1)
                .style("transform", "scaleX(1)")
                .style("background-color", "#F7F2EA");
        })

        //TOOLTIP DESAPARECE -----------------------------------
        .on("mouseout", function (event, d) {
            //verifica qual o mapa que está a aparecer e a sua escala de cores
            let key = dados[currentStep];
            let scale = colorScales[key];

            //vai buscar o valor real do concelho
            let value = d.properties[key];
            let classIndex = getClassIndex(scale, value);

            let color;

            //repõe a cor original
            if (value == null || isNaN(value)) {
                color = "#999";
            } else if (isHidden(classIndex)) {
                color = "#ffffff";
            } else {
                color = scale(value);
            }

            d3.select(this)
                .transition()
                .duration(150)
                .attr("fill", color);

            tooltip
                .interrupt()
                .transition()
                .duration(200)
                .ease(d3.easeCubicIn)
                .style("opacity", 0);
        })

    drawLegend(0);//desenha a legenda
}



//FUNÇÃO QUE DESENHA A LEGENDA -----------------------------------------------------
function drawLegend(step) {

    //coloca a escala de cores de acordo com o step atual
    let key = dados[step];
    let scale = colorScales[key];

    //devolve as cores e os intervalos a usar
    let colors = scale.range();
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
    
    legend
        .append("h2")
        .attr("class", "legend_title")
        .text(legendTitles[key]);


    //elimina o primeiro index (0) por ser < que o primeiro limite
    let legendData = colors.slice(1).map((c, i) => ({
        color: c,
        index: i + 1
    }));


    let items = legend
        .selectAll(".legend_item")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend_item")
        .style("cursor", "pointer")

        .on("click", function (event, d) {

            if (hiddenClasses.has(d.index)) {
                hiddenClasses.delete(d.index);
            }
            else {
                hiddenClasses.add(d.index);
            }

            updateLegendVisual();
            updateMapColors();
        });

    items
        .append("div")
        .attr("class", "legend_color")
        .style("background-color", d => {

            if (isHidden(d.index)) {
                return "#ffffff";
            } else {
                return d.color;
            }
        });


    items
        .append("div")
        .attr("class", "legend_label")
        .text((d, i) => labels[i]);

    updateLegendVisual();
}


//FUNÇÃO QUE ATUALIZA O ASPETO DA LEGENDA -----------------------------------------
function updateLegendVisual() {

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



//FUNÇÃO QUE ATUALIZA AS CORES DO MAPA --------------------------------------------
function updateMapColors() {

    if (!mapa) return;

    let key = dados[currentStep];
    let scale = colorScales[key];

    //muda a cor dos mapas consoante 
    mapa
        .interrupt()
        .transition()
        .duration(450)

        .attr("fill", d => {

            let value = d.properties[key];

            if (value == null || isNaN(value)) return "#999";

            let classIndex = getClassIndex(scale, value);

            if (isHidden(classIndex)) {
                return "#ffffff";
            }

            return scale(value);
        });
}


//FUNÇÃO QUE DEFINE AS CORES DOS MAPAS ---------------------------------------------------
function setColorScales() {

    const colorScale_0 = d3.scaleThreshold()
        .domain([5.8, 10.4, 13.9, 18.3, 25.9]) // Threshold breakpoints
        .range(["#999", "#ebd2ca", "#f2ae9c", "#b00920", "#5e2a2d"]);

    colorScales["percentagem"] = colorScale_0;

    const colorScale_1 = d3.scaleThreshold()
        .domain([47, 3085, 8779, 20270, 47748]) // Threshold breakpoints
        .range(["#999", "#ebd2ca", "#f2ae9c", "#b00920", "#5e2a2d"]);

    colorScales["total"] = colorScale_1;


    const colorScale_2 = d3.scaleThreshold()
        .domain([30, 1529, 3953, 7978, 15343, 41002]) // Threshold breakpoints
        .range(["#999", "#dddcdd", "#b7c8c2", "#8cbdab", "#6e9486", "#3f544c"]);

    colorScales["bons"] = colorScale_2;

    const colorScale_3 = d3.scaleThreshold()
        .domain([0.45, 1, 1.28, 1.63, 2.59]) // Threshold breakpoints
        .range(["#999", "#ebd2ca", "#f2ae9c", "#b00920", "#5e2a2d"]);

    colorScales["retencao"] = colorScale_3;

    const colorScale_4 = d3.scaleThreshold()
        .domain([-21.6, -20, -15, -10, -5, 0, 5, 10, 13.3]) // Threshold breakpoints
        .range(["#999", "#5e2a2d", "#b00920", "#f2ae9c", "#ebd2ca", "#b7c8c2", "#8cbdab", "#6e9486", "#3f544c"]);

    colorScales["variacao"] = colorScale_4;
}


//FUNÇÃO QUE ATUALIZA OS MAPAS --------------------------------------------------------
export function updateMap(step) {

    currentStep = step;

    if (m_svg || mapa) {
        // svg.select("text").remove();
        // svg.append("text").text(step).attr("y", 100);

        mapa
        drawLegend(step);//desenha a legenda consoante o mapa
        updateMapColors();
    }
}