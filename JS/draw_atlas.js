//este ficheiro é dedicado a desenhar o mapa de portugal por concelhos

export function draw_map(geojson, csvData) {
    //cria um elemento svg dentro da class da grelha
    let svg = d3.select('.atlas_grid_container')
        .append('svg')
        .attr('class', 'mapa_svg');//atribui a class do mapa a esse elemento

    // tamanhero real que o retângulo ocupado no ecrã
    let bounds = svg.node().getBoundingClientRect();

    let width = bounds.width; //largua do svg -> mapa
    let height = bounds.height; //altura do svg -> mapa

    svg.attr("viewBox", `0 0 ${width} ${height}`);//define as coordenadas

    let projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    //desenha o mapa
    let path = d3.geoPath()
        .projection(projection);

    //desenha os concelhos
    svg.append("g")
        .selectAll("path")
        .data(geojson.features)//liga os dados geoJson aos elementos svg
        .enter()
        .append("path")//cria um path para cada concelho
        .attr("d", path)//para cada concelho, pega na geometria e transforma-a em desenho no mapa
        .attr("fill", d => {
            //procura os dados o id do csv correspondente ao DICO do geojson
            let match = csvData.find(c => c.id === +d.properties.DICO);
            //se não encontrar o concelho em comum preenche com cinza
            if (!match) return "#ccc";

            return getColor(match.percentagem);
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5); //espessura da linha do mapa   
}

function getColor(percentagem) {
    if (percentagem >= 5.8 && percentagem < 10.4) {
        return "#ebd2ca";
    }
    else if (percentagem >= 10.4 && percentagem < 13.9) {
        return "#f2ae9c";
    }
    else if (percentagem >= 13.9 && percentagem < 18.3) {
        return "#b00920";
    }
    else if (percentagem >= 18.3 && percentagem < 25.9) {
        return "#5e2a2d";
    }
}