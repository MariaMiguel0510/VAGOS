//data
let geoMap = "./data/concelhos_continente.geojson";

window.onload = function () {
    let promises = [
        d3.json(geoMap), //guarda os dados para desenhar cada concelho
    ];

    //só depois de descarregar todos os dados é que os envia para a função draw_map
    Promise.all(promises).then(draw_map);
}

function draw_map(data) {
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
        .fitSize([width, height], data[0]);

    //desenha o mapa
    let path = d3.geoPath()
        .projection(projection);

    //desenha os concelhos
    svg.append("g")
        .selectAll("path")
        .data(data[0].features)//liga os dados geoJson aos elementos svg
        .enter()
        .append("path")//cria um path para cada concelho
        .attr("d", path)//para cada concelho, pega na geometria e transforma-a em desenho no mapa
        .attr("fill", "#f5f5f5")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5); //espessura da linha do mapa   
}


