// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
let m_svg = null; //guarda o mapa
let mapa = null; //guarda todos os path dos concelhos


let colorScales = {};
const dados = ["percentagem", "total", "bons", "retencao", "carencias"];

let currentStep = 0;
let hiddenClasses = new Set();


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
        .attr("stroke-width", 0.35);

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
            `${thresholds[i - 1]} – ${thresholds[i]}`
        );
    }

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
        .style("font-style", d => {
            if (isHidden(d.index)) {
                return "italic";
            } else {
                return "normal";
            }
        });

    //coloca o bloco de cor a branco
    d3.selectAll(".legend_color")
        .style("background-color", d => {
            if (isHidden(d.index)) {
                return "#ffffff";
            } else {
                return d.color;
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
        .duration(350)

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
        .range(["#999", "#5e2a2d", "#b00920", "#f2ae9c", "#ebd2ca", "#b7c8c2", "#8cbdab", "#6e9486", "#3f544c", "#000"]);

    colorScales["carencias"] = colorScale_4;
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