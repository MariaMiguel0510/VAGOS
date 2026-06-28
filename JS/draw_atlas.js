// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
import { drawLegend, updateLegendVisual } from "./legend_atlas.js";
import { createTooltip } from "./tooltip_atlas.js";

let m_svg = null; //guarda o mapa
let mapa = null; //guarda todos os path dos concelhos

let textureMapBlack = {};
let textureMapYellow = {};
let textureScales = {};
const dados = ["percentagem", "total", "bons", "retencao", "variacao", "local"];

let currentStep = 0;
let hiddenClasses = new Set();

let corTextura = "#000";

//FUNÇÃO QUE DESENHA O MAPA -----------------------------------------------------------------
export function draw_map(geojson, csvData) {

    //transforma o array do CSV num Map para procurar os id por índices e ser mais rápido
    let csvMap = new Map(csvData.map(d => [d.id, d]));

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
    container.selectAll("svg").remove();

    //cria o svg
    m_svg = container
        .append("svg")
        .attr("class", "mapa_svg");

    //cria e aplica as texturas no mapa
    setTextureScales();
    createTextures();

    //determina as medidas da largura da janela 
    //para que a largura do mapa seja responsiva
    let width = container.node().clientWidth;
    let height = container.node().clientHeight;

    m_svg.attr("viewBox", `0 0 ${width} ${height}`);

    let projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    let path = d3.geoPath().projection(projection);
    let portugalBounds = path.bounds(geojson);

    let { show, hide } = createTooltip({
    dados,
    currentStep,
    path,
    m_svg,
    width,
    portugalBounds,
    textureScales,
    getClassIndex,
    isHidden
});

    //desenha o mapa
    mapa = m_svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("stroke-width", 0.5)
        //.attr("stroke", "#000000")
        .attr("d", path)
        .attr("fill", d => {
            let key = dados[currentStep];
            let scale = textureScales[key];
            let value = d.properties[key];

            if (value == null || isNaN(value))
                return "#999";

            let classIndex = getClassIndex(scale, value);

            if (isHidden(classIndex))
                return "#ffffff";

            return getTexture(scale, value);
        })

        //MOUSEOVER SOBRE O MAPA -> TEXTURA AMARELA E TOOLTIP APARECE
        .on("mouseover", function (event, d) {
            let key = dados[currentStep];
            let scale = textureScales[key];
            let value = d.properties[key];

            d3.select(this)
                .attr("fill", getTexture(scale, value, true))
                .transition()
                .duration(300)
                .style("opacity", 1)
                .style("cursor", "pointer");

            show(event, d);
        })

        //MOUSEOUT SOBRE O MAPA -> TEXTURA PRETA E TOOLTIP DESAPARECE
        .on("mouseout", function (event, d) {
            let key = dados[currentStep];
            let scale = textureScales[key];
            let value = d.properties[key];

            d3.select(this)
                .transition()
                .duration(150)
                .attr("fill", getTexture(scale, value));

            hide.call(this, event, d);
        })

    drawLegend({
        step: currentStep,
        dados,
        textureScales,
        textureMapBlack,
        hiddenClasses,
        isHidden,
        onToggleClass: (index) => {
            if (hiddenClasses.has(index)) {
                hiddenClasses.delete(index);
            } else {
                hiddenClasses.add(index);
            }

            updateLegendVisual(
                d3.select(".legend_container"),
                textureMapBlack,
                hiddenClasses,
                isHidden
            );

            updateMapTexture();
        }
    });

    updateMapTexture();
}

//FUNÇÃO QUE ATUALIZA O MAPA ----------------------------------------------------------
export function updateMap(step) {

    currentStep = step;

    if (m_svg || mapa) {
        // svg.select("text").remove();
        // svg.append("text").text(step).attr("y", 100);

        drawLegend({
            step: currentStep,
            dados,
            textureScales,
            textureMapBlack,
            hiddenClasses,
            isHidden,
            onToggleClass: (index) => {
                if (hiddenClasses.has(index)) {
                    hiddenClasses.delete(index);
                } else {
                    hiddenClasses.add(index);
                }

                updateLegendVisual(
                    d3.select(".legend_container"),
                    textureMapBlack,
                    hiddenClasses,
                    isHidden
                );

                updateMapTexture();
            }
        });

        updateMapTexture();
    }
}


//FUNÇÃO QUE ATUALIZA AS TEXTURAS DO MAPA --------------------------------------------
function updateMapTexture() {
    if (!mapa) return;

    let key = dados[currentStep];
    let scale = textureScales[key];

    //muda a textura dos mapas consoante 
    mapa
        .interrupt()
        .transition()
        .duration(450) //efeito transição

        //preenche o espaço
        .attr("fill", d => {

            let value = d.properties[key];

            //de cinzento se o valor for nulo
            if (value == null || isNaN(value))
                return "#999";

            let classIndex = getClassIndex(scale, value);

            //de branco
            if (isHidden(classIndex))
                return "#ffffff";

            return getTexture(scale, value);
        });
}


//FUNÇÃO QUE DEFINE AS TEXTURAS DOS MAPAS ---------------------------------------------------
function setTextureScales() {

    const textureScale_0 = d3.scaleThreshold()
        .domain([5.8, 10.4, 13.9, 18.3, 25.9]) // Threshold breakpoints
        .range([0, 0.6, 1.1, 1.5, 1.8]);

    textureScales["percentagem"] = textureScale_0;

    const textureScale_1 = d3.scaleThreshold()
        .domain([47, 3085, 8779, 20270, 47748]) // Threshold breakpoints
        .range([0, 0.6, 1.1, 1.5, 2]);

    textureScales["total"] = textureScale_1;

    const textureScale_2 = d3.scaleThreshold()
        .domain([30, 1529, 3953, 7978, 15343, 41002]) // Threshold breakpoints
        .range([0, 0.6, 1.1, 1.5, 1.7, 2]);

    textureScales["bons"] = textureScale_2;

    const textureScale_3 = d3.scaleThreshold()
        .domain([0.45, 1, 1.28, 1.63, 2.59]) // Threshold breakpoints
        .range([0, 0.6, 1.1, 1.5, 1.8]);

    textureScales["retencao"] = textureScale_3;

    const textureScale_4 = d3.scaleThreshold()
        .domain([-21.6, -20, -15, -10, -5, 0, 5, 10, 13.3]) // Threshold breakpoints
        .range([0, 0.5, 0.8, 1.1, 1.3, 1.6, 2, 2.3, 2.6]);

    textureScales["variacao"] = textureScale_4;
}


//FUNÇÃO QUE CRIA AS TEXTURAS -------------------------------------------------------
function createTextures() {
    //cria um array de largura dos quadrados para cada mapa
    let widths = new Set();

    //cria uma textura para cada largura
    Object.values(textureScales).forEach(scale => {
        scale.range().forEach(v => widths.add(v));
    });

    //cria uma textura para cada range
    [...widths].forEach(width => {

        //cria a textura
        let black_texture = textures
            .paths()
            .d("squares")
            .size(4)
            .strokeWidth(width)
            .stroke("#000");

        let yellow_texture = textures
            .paths()
            .d("squares")
            .size(4)
            .strokeWidth(width)
            .stroke("#FFD700");

        m_svg.call(black_texture);
        m_svg.call(yellow_texture);

        textureMapBlack[width] = black_texture;
        textureMapYellow[width] = yellow_texture;
    });
}

//FUNÇÃO PARA OBTER A TEXTURA --------------------------------------------------
function getTexture(scale, value, highlight = false) {

    let width = scale(value);

    if (highlight) {
        return textureMapYellow[width].url();
    }

    return textureMapBlack[width].url();
}



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

