//este ficheiro carrega os dados dos ficheiros geojson e csv para desenhar os mapas
import { draw_map } from "./draw_atlas.js";

let geoMap = "./data/concelhos_continente.geojson";
let atlas = "./data/atlas.csv";

Promise.all([

    d3.json(geoMap),

    d3.dsv(";", atlas, d => {
        return {
            id: +d.DICO.trim(),
            local: d.CONCELHO,
            zona_geral: d.NUTSII_24,
            zona_esp: d.NUTSIII_24,
            carencias: +d.T_CAR_ELH,
            bons: +d.T_VAG_B,
            total: +d.T_VAG_21,
            percentagem: +d.P_VAG_21.replace(",", "."),
            retencao: +d.P_VAG_RET.replace(",", ".")
        };
    })

]).then(([geojson, csvData]) => {

    draw_map(geojson, csvData);

});
