// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
import { drawLegend, updateLegendVisual } from "./legend_atlas.js";
import { createTooltip } from "./tooltip_atlas.js";
import { setTextureScales, createTextures, getTexture, getClassIndex, getTextureMapBlack } from "./texture_atlas.js";
import { calculateMapGeometry, resizeMap, correctGeoJSONOrientation } from "./geometry_atlas.js";

let m_svg = null; //guarda o mapa
let mapPath = null;
let mapa = null; //guarda todos os path dos concelhos
let currentStep = 0;
let hiddenClasses = new Set();
let currentMapKey = null;
let tooltipFunctions = null;
let stepDataByIndex = new Map();// guarda os dados dos steps provenientes do CSV
let textureScales = {};
let resizeHandler = null;
let legendHasAppeared = false;


//FUNÇÃO QUE DESENHA O MAPA -----------------------------------------------------------------
export function draw_map(geojson, csvData) {
    mergeAtlasData(geojson, csvData);

    //corrige a orientação das coordenadas para desenhar o mapa apenas uma vez
    correctGeoJSONOrientation(geojson);

    //seleciona o contentor onde o mapa vai ser desenhado
    let container = d3.select(".draw_atlas");
    //evita criar vários mapas 
    container.selectAll("svg").remove();

    //cria o svg
    m_svg = container
        .append("svg")
        .attr("class", "mapa_svg")
        //faz com que o stroke não apareça inicialmente
        .style("visibility", currentMapKey ? "visible" : "hidden")
        .style("opacity", currentMapKey ? 1 : 0);

    //cria e aplica as texturas no mapa
    textureScales = setTextureScales();
    createTextures(m_svg);

    let geometry = calculateMapGeometry(geojson);

    mapPath = geometry.path;

    let portugalBounds = geometry.bounds;

    m_svg.attr(
        "viewBox",
        `0 0 ${geometry.width} ${geometry.height}`
    );

    tooltipFunctions = createTooltip({
        getCurrentMapKey: () => currentMapKey,
        path: mapPath,
        m_svg,
        portugalBounds
    });

    let { show, hide } = tooltipFunctions;

    //desenha o mapa
    mapa = m_svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", mapPath)
        .attr("fill", getMunicipalityFill)
        .attr("stroke", "#000")   // cor do contorno
        .attr("stroke-width", 0.5)  // espessura


        //MOUSEOVER SOBRE O MAPA -> TEXTURA AMARELA E TOOLTIP APARECE
        .on("mouseover", function (event, d) {
            let municipalityData = getMunicipalityData(d);

            if (!municipalityData) return;

            let { scale, value, classIndex } = municipalityData;

            //se a legenda estiver escondida a tooltip não funciona
            if (isHidden(classIndex)) return;

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
            let municipalityData = getMunicipalityData(d);

            if (!municipalityData) return;

            let { scale, value, classIndex } = municipalityData;

            //se a legenda estiver escondida a tooltip não funciona
            if (isHidden(classIndex)) return;

            d3.select(this)
                .transition()
                .duration(150)
                .attr("fill", getTexture(scale, value));

            hide();
        })


    if (currentMapKey) {
        updateMapLegend();
    }
    updateMapTexture();

    if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
    }

    resizeHandler = () => {
        resizeMap({
            geojson,
            svg: m_svg,
            paths: mapa,
            tooltip: tooltipFunctions
        });
    };

    window.addEventListener("resize", resizeHandler);
}


//GUARDA OS DADOS DOS STEPS PARA SEREM USADOS NOUTROS FICHEIROS EXTERNOS
export function setStepData(groupedData) {
    stepDataByIndex = groupedData;
}

//VERIFICA SE ALGUMA DAS CLASSES DA LEGENDA ESTÁ ESCONDIDA
function isHidden(index) {
    return hiddenClasses.has(index);
}

//IDENTIFICA QUAL É A LEGEND_KEY (CSV)
function getStepLegendKey(step) {
    let stepData = stepDataByIndex.get(String(step));

    if (!stepData) return null;

    let legendInfo = stepData.find(d => d.legend_key?.trim());

    return legendInfo?.legend_key.trim() ?? null;
}

//ALTERA A VISIBILIDADE DAS CLASSES DA LEGENDA (VISÍVEIS/INVISÍVEIS)
function toggleLegendClass(index) {

    if (hiddenClasses.has(index)) {
        hiddenClasses.delete(index);
    } else {
        hiddenClasses.add(index);
    }

    // atualiza o aspeto da legenda
    updateLegendVisual(
        d3.select(".legend_container"),
        getTextureMapBlack(),
        hiddenClasses,
        isHidden
    );

    // atualiza as texturas do mapa
    updateMapTexture();
}

//OBTÉM OS DADOS NECESSÁRIOS PARA REPRESENTAR UM DADO CONCELHO
function getMunicipalityData(d) {
    let key = currentMapKey;

    if (!key || !textureScales[key]) return null;

    let scale = textureScales[key];
    let value = d.properties[key];

    if (value == null || isNaN(value)) return null;

    let classIndex = getClassIndex(scale, value);

    return {
        scale,
        value,
        classIndex
    };
}

//DETERMINA A TEXTURA DE CADA CONCELHO
function getMunicipalityFill(d) {
    let municipalityData = getMunicipalityData(d);

    if (!municipalityData) {
        return currentMapKey ? "#999" : "none";
    }

    let { scale, value, classIndex } = municipalityData;

    if (isHidden(classIndex)) return "#F7F2EA";

    return getTexture(scale, value);
}

//JUNTA OS DADOS CSV COM OS DADOS GEOGRÁFICOS DO GEOJSON
function mergeAtlasData(geojson, csvData) {
    //cria o mapa com os dados do csv
    let csvMap = new Map(csvData.map(d => [d.id, d]));

    //percorre todos os concelhos
    geojson.features.forEach(feature => {
        let match = csvMap.get(+feature.properties.DICO);

        if (match) {
            Object.keys(match).forEach(key => {
                if (key !== "id") {
                    //associa os dados encontrados
                    feature.properties[key] = match[key];
                }
            });
        }
    });

    return geojson;
}

//ATUALIZA O MAPA ----------------------------------------------------------
export function updateMap(step) {

    currentStep = step;

    // identifica o mapa correspondente ao step
    currentMapKey = getStepLegendKey(step);

    //controla a visibilidade do download
    let download = d3.select(".download_container");
    let legend = d3.select(".legend_container");

    //quando mudo de step, se tiver alguma parte da legenda invisível, depois volta a ficar visível
    hiddenClasses.clear();

    if (m_svg && mapa) {

        // Se o capítulo não tiver mapa
        if (!currentMapKey) {
            m_svg
                .interrupt()
                .transition()
                .duration(300)
                .style("opacity", 0)
                .on("end", function () {
                    d3.select(this).style("visibility", "hidden");
                });

            legend
                .interrupt()
                .style("pointer-events", "none")
                .transition()
                .duration(300)
                .style("opacity", 0);

            download
                .interrupt()
                .transition()
                .duration(300)
                .style("opacity", 0)
                .on("end", function () {
                    d3.select(this).style("visibility", "hidden");
                });

            return;
        }

        //volta a apresentar o SVG
        m_svg
            .interrupt()
            .style("visibility", "visible")
            .transition()
            .duration(300)
            .style("opacity", 1);

        download
            .interrupt()
            .style("visibility", "visible")
            .transition()
            .duration(300)
            .style("opacity", 1);

        updateMapLegend();

        legend.style("pointer-events", "auto");

        //se a legenda estiver a ser desenhada e for desaparecer
        if (!legendHasAppeared) {
            legend
                .interrupt()
                .style("opacity", 0)
                .transition()
                .duration(400)
                .style("opacity", 1);

            legendHasAppeared = true; //legenda escondida
        } else {
            //se não legenda aparece
            legend
                .interrupt()
                .style("opacity", 1);
        }

        updateMapTexture();
    }
}

//ATUALIZA AS TEXTURAS DO MAPA --------------------------------------------
function updateMapTexture() {
    if (!mapa || !currentMapKey) return;

    //muda a textura dos mapas consoante 
    mapa
        .interrupt()
        .transition()
        .duration(450) //efeito transição

        //preenche o espaço
        .attr("fill", getMunicipalityFill)
}

//ATUALIZA AS LEGENDAS --------------------------------------------
function updateMapLegend() {
    drawLegend({
        stepData: stepDataByIndex.get(String(currentStep)),
        textureScales,
        textureMapBlack: getTextureMapBlack(),
        hiddenClasses,
        isHidden,
        onToggleClass: toggleLegendClass
    });
}





