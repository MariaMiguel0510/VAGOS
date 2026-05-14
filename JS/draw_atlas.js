// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
let svg = null;
let mapa = null;
let raf = null;

export function draw_map(geojson, csvData) {

    // índice rápido do CSV
    let csvMap = new Map(csvData.map(d => [d.id, d]));

    // junta dados + pré-calcula cores
    geojson.features.forEach(feature => {

        let match = csvMap.get(+feature.properties.DICO);

        if (!match) return;

        feature.properties.percentagem = match.percentagem;
        feature.properties.total = match.total;
        feature.properties.bons = match.bons;
        feature.properties.retencao = match.retencao;
        feature.properties.carencias = match.carencias;

        // pré-calcular cores por step 
        feature.colors = {
            0: getStepColor(0, match.percentagem),
            1: getStepColor(1, match.total),
            2: getStepColor(2, match.bons),
            3: getStepColor(3, match.retencao),
            4: getStepColor(4, match.carencias),
        };
    });

    let container = d3.select(".atlas_grid_container");

    container.selectAll("svg").remove();

    svg = container
        .append("svg")
        .attr("class", "mapa_svg");

    let width = container.node().clientWidth;
    let height = container.node().clientHeight;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    let projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    let path = d3.geoPath().projection(projection);

    // desenhar mapa
    mapa = svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)

        // cor inicial (step 0)
        .attr("fill", d => d.colors?.[0] ?? "#999")

        .attr("stroke", "#333")
        .attr("stroke-width", 0.35)

        // ajuda na performance SVG
        .style("vector-effect", "non-scaling-stroke")
        .style("shape-rendering", "geometricPrecision");
}


function getStepValue(step, d) {

    switch (step) {
        case 0: return d.properties.percentagem;
        case 1: return d.properties.total;
        case 2: return d.properties.bons;
        case 3: return d.properties.retencao;
        case 4: return d.properties.carencias;
        default: return null;
    }
}

//cores de cada um dos mapas
function getStepColor(step, value) {

    if (value == null || isNaN(value)) return "#999";

    switch (step) {
        //mapa 1
        case 0:
            if (value >= 5.8 && value < 10.4) return "#ebd2ca";
            if (value >= 10.4 && value < 13.9) return "#f2ae9c";
            if (value >= 13.9 && value < 18.3) return "#b00920";
            if (value >= 18.3 && value <= 25.9) return "#5e2a2d";
            break;
        //mapa 2
        case 1:
            if (value >= 47 && value < 3085) return "#ebd2ca";
            if (value >= 3085 && value < 8779) return "#f2ae9c";
            if (value >= 8779 && value < 20270) return "#b00920";
            if (value >= 20270 && value <= 47748) return "#5e2a2d";
            break;
        //mapa 3
        case 2:
            if (value >= 30 && value < 1529) return "#dddcdd";
            if (value >= 1529 && value < 3953) return "#b7c8c2";
            if (value >= 3953 && value < 7978) return "#8cbdab";
            if (value >= 7978 && value < 15343) return "#6e9486";
            if (value >= 15343 && value <= 41002) return "#3f544c";
            break;
        //mapa 4
        case 3:
            if (value >= 0.45 && value < 1) return "#ebd2ca";
            if (value >= 1 && value < 1.28) return "#f2ae9c";
            if (value >= 1.28 && value < 1.63) return "#b00920";
            if (value >= 1.63 && value <= 2.59) return "#5e2a2d";
            break;
        //mapa 5
        case 4:
            if (value >= -21.6 && value < -20) return "#5e2a2d";
            if (value >= -20 && value < -15) return "#b00920";
            if (value >= -15 && value < -10) return "#f2ae9c";
            if (value >= -10 && value < -5) return "#ebd2ca";
            if (value >= -5 && value < 0) return "#b7c8c2";
            if (value >= 0 && value < 5) return "#8cbdab";
            if (value >= 5 && value < 10) return "#6e9486";
            if (value >= 10 && value <= 13.3) return "#3f544c";
            break;
    }

    return "#999";
}

//atualiza em que step vou
export function updateMap(step) {

    if (!svg || !mapa) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {

        mapa.attr("fill", d => d.colors?.[step] ?? "#999");
    });
}