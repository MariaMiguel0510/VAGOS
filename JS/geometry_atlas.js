//CALCULA A GEOMETRIA DO MAPA
export function calculateMapGeometry(geojson) {
    //corrige a orientação dos anéis dos polígonos de cada concelho, invertendo a ordem das coordenadas
    //csta correção evita que o D3 interprete o território como a área complementar do globo,
    //garantindo que cada concelho é representado corretamente na projeção cartográfica
    //abrange geometrias do tipo Polygon e MultiPolygon

    //percorre todos os concelhos
    geojson.features.forEach(feature => {

        //guarda a geometria do concelho atual.
        const geometry = feature.geometry;

        //verifica se a geometria é um polígono simples.
        if (geometry.type === "Polygon") {

            //percorre o perímetro de cada polígono e inverte a ordem
            // das coordenadas de cada um 
            geometry.coordinates = geometry.coordinates.map(ring =>
                ring.slice().reverse()
            );
        }
        //verifica se a geometria é composta por vários polígonos
        if (geometry.type === "MultiPolygon") {
            //percorre cada polígono e os respetivos perímetros,
            //invertendo a ordem das coordenadas de cada um
            geometry.coordinates = geometry.coordinates.map(polygon =>
                polygon.map(ring => ring.slice().reverse())
            );
        }
    });

    let container = d3.select(".draw_atlas");
    let height = container.node().clientHeight;

    let projection = d3.geoMercator()
        .fitHeight(height, geojson);

    let path = d3.geoPath().projection(projection);
    let bounds = path.bounds(geojson);

    let translate = projection.translate();

    projection.translate([
        translate[0] - bounds[0][0],
        translate[1] - bounds[0][1]
    ]);

    path = d3.geoPath().projection(projection);
    bounds = path.bounds(geojson);

    return {
        path,
        bounds,
        width: bounds[1][0],
        height: bounds[1][1]
    };
}


//REDIMENSIONA O MAPA
export function resizeMap({
    geojson,
    svg,
    paths,
    tooltip
}) {

    if (!svg || !paths || !geojson) return;

    let container = d3.select(".draw_atlas");

    if (container.empty() || container.node().clientHeight === 0) return;

    let geometry = calculateMapGeometry(geojson);

    svg.attr(
        "viewBox",
        `0 0 ${geometry.width} ${geometry.height}`
    );

    paths
        .interrupt()
        .attr("d", geometry.path);

    if (tooltip) {
        tooltip.updateGeometry(
            geometry.path,
            geometry.bounds
        );

        tooltip.hide();
    }
}