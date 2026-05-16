// este ficheiro é dedicado a desenhar o mapa de portugal por concelhos
let svg = null; //guarda o mapa
let mapa = null; //guarda todos os math dos concelhos


export function draw_map(geojson, csvData) {

    //transforma o array do CSV num Map para procurar os id por índices e ser mais rápido
    let csvMap = new Map(csvData.map(d => [d.id, d]));

    //junta os dados do geojson com os do csv
    geojson.features.forEach(feature => {

        //procura a correspondência entre o geojson e o csv
        let match = csvMap.get(+feature.properties.DICO);

        if (!match) {
            return;
        }

        feature.properties.percentagem = match.percentagem;
        feature.properties.total = match.total;
        feature.properties.bons = match.bons;
        feature.properties.retencao = match.retencao;
        feature.properties.carencias = match.carencias;

        //pré-calcular cores a usar para cada step
        feature.colors = {
            0: getStepColor(0, match.percentagem),
            1: getStepColor(1, match.total),
            2: getStepColor(2, match.bons),
            3: getStepColor(3, match.retencao),
            4: getStepColor(4, match.carencias),
        };
    });

    //seleciona o contentor onde o mapa vai ser desenhado
    let container = d3.select(".atlas_grid_container");
    //evita criar vários mapas 
    container.selectAll("svg").remove();

    //cria o svg
    svg = container
        .append("svg")
        .attr("class", "mapa_svg");

    //determina as medidas da largura da janela 
    //para que a largura do mapa seja responsiva
    let width = container.node().clientWidth;
    let height = container.node().clientHeight;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    let projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    let path = d3.geoPath().projection(projection);

    //desenha o mapa
    mapa = svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)

        //cor inicial do mapa (step 0)
        .attr("fill", d => d.colors?.[0] ?? "#999")

        .attr("stroke", "#F7F2EA")
        .attr("stroke-width", 0.35);
}

//cores de cada um dos mapas
function getStepColor(step, value) {

    if (value == null || isNaN(value)) {
        return "#999";
    }

    //para cada step corresponde um mapa
    switch (step) {
        //mapa 1
        case 0:
            if (value >= 5.8 && value < 10.4) {
                return "#ebd2ca";
            } else if (value >= 10.4 && value < 13.9) {
                return "#f2ae9c";
            } else if (value >= 13.9 && value < 18.3) {
                return "#b00920";
            } else if (value >= 18.3 && value <= 25.9) {
                return "#5e2a2d";
            }
            break;

        //mapa 2
        case 1:
            if (value >= 47 && value < 3085) {
                return "#ebd2ca";
            } else if (value >= 3085 && value < 8779) {
                return "#f2ae9c";
            } else if (value >= 8779 && value < 20270) {
                return "#b00920";
            } else if (value >= 20270 && value <= 47748) {
                return "#5e2a2d";
            }
            break;

        //mapa 3
        case 2:
            if (value >= 30 && value < 1529) {
                return "#dddcdd";
            } else if (value >= 1529 && value < 3953) {
                return "#b7c8c2";
            } else if (value >= 3953 && value < 7978) {
                return "#8cbdab";
            } else if (value >= 7978 && value < 15343) {
                return "#6e9486";
            } else if (value >= 15343 && value <= 41002) {
                return "#3f544c";
            }
            break;
        //mapa 4
        case 3:
            if (value >= 0.45 && value < 1) {
                return "#ebd2ca";
            } else if (value >= 1 && value < 1.28) {
                return "#f2ae9c";
            } else if (value >= 1.28 && value < 1.63) {
                return "#b00920";
            } else if (value >= 1.63 && value <= 2.59) {
                return "#5e2a2d";
            }
            break;
        //mapa 5
        case 4:
            if (value >= -21.6 && value < -20) {
                return "#5e2a2d";
            } else if (value >= -20 && value < -15) {
                return "#b00920";
            } else if (value >= -15 && value < -10) {
                return "#f2ae9c";
            } else if (value >= -10 && value < -5) {
                return "#ebd2ca";
            } else if (value >= -5 && value < 0) {
                return "#b7c8c2";
            } else if (value >= 0 && value < 5) {
                return "#8cbdab";
            } else if (value >= 5 && value < 10) {
                return "#6e9486";
            } else if (value >= 10 && value <= 13.3) {
                return "#3f544c";
            }
            break;
    }

    return "#999";
}


//muda o mapa sem redesenhar tudo -> muda só a cor
export function updateMap(step) {

    if (!svg || !mapa) return;

    mapa
        .transition()//cria transição entre as cores
        .duration(600)//duração da transição

        //atualiza as cores para cada step
        .attr("fill", function (d) {

            if (d.colors && d.colors[step] != null) {
                return d.colors[step];
            }

            return "#999";
        })
}