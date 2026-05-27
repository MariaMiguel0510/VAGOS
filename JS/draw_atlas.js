// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
let m_svg = null; //guarda o mapa
let mapa = null; //guarda todos os path dos concelhos


let colorScales = {};
const dados = ["percentagem", "total", "bons", "retencao", "carencias"];


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

        //cor inicial do mapa (step 0)
        .attr("fill", d => {
            return colorScales[dados[0]](d.properties[dados[0]])
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

    //primeiro limite 
    labels.push(`≤ ${thresholds[0]}`);

    //todos os valores intermédios
    for (let i = 1; i < thresholds.length; i++) {
        labels.push(
            `${thresholds[i - 1]} – ${thresholds[i]}`
        );
    }

    //coloca o último limite como maior que >
    labels.push(`> ${thresholds[thresholds.length - 1]}`);


    let items = legend
        .selectAll(".legend_item")
        .data(colors)
        .enter()
        .append("div")
        .attr("class", "legend_item");

    //parte da cor
    items
        .append("div")
        .attr("class", "legend_color")
        .style("background-color", d => d);

    //parte do texto
    items
        .append("div")
        .attr("class", "legend_label")
        .text((d, i) => labels[i]);
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



//FUNÇÃO QUE MUDA A COR DO MAPA --------------------------------------------------------
export function updateMap(step) {

    if (m_svg || mapa) {
        // svg.select("text").remove();
        // svg.append("text").text(step).attr("y", 100);

        mapa
            .transition()//cria transição entre as cores
            .duration(250)//duração da transição

            //atualiza as cores para cada step
            .attr("fill", d => (d.properties[dados[step]] == null || isNaN(d.properties[dados[step]])) ?
                "#999" : colorScales[dados[step]](d.properties[dados[step]]));

          drawLegend(step);//desenha a legenda consoante o mapa
    }
}