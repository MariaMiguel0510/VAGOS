//CALCULA A GEOMETRIA DO MAPA
export function calculateMapGeometry(geojson) {

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
