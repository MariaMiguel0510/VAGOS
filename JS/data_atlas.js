//este ficheiro limita-se a carregar e devolver os dados sem chamar diretamente o mapa
export function loadAtlasData() {

    let geoMap = "./data/concelhos_continente.geojson";
    let atlas = "./data/atlas.csv";

    return Promise.all([

        d3.json(geoMap),

        d3.dsv(";", atlas, d => ({
            id: +d.DICO.trim(),
            local: d.CONCELHO,
            zona_geral: d.NUTSII_24,
            zona_esp: d.NUTSIII_24,
            carencias: +d.T_CAR_ELH,
            bons: +d.T_VAG_B,
            total: +d.T_VAG_21,
            variacao: +d.V_POP_1121.replace(",", "."),
            percentagem: +d.P_VAG_21.replace(",", "."),
            retencao: +d.P_VAG_RET.replace(",", ".")
        }))
    ]);
}