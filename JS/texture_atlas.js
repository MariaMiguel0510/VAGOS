let textureMapBlack = {};
let textureMapYellow = {};
let textureScales = {};


//DEFINE AS TEXTURAS DOS MAPAS ---------------------------------------------------
export function setTextureScales() {

    const textureScale_0 = d3.scaleThreshold()
        .domain([5.8, 10.4, 13.9, 18.3, 25.9]) // Threshold breakpoints
        .range([0, 0.2, 0.7, 1, 1.2, 0]);

    textureScales["percentagem"] = textureScale_0;

    const textureScale_1 = d3.scaleThreshold()
        .domain([47, 3085, 8779, 20270, 47748]) // Threshold breakpoints
        .range([0, 0.2, 0.7, 1, 1.2, 0]);

    textureScales["total"] = textureScale_1;

    const textureScale_2 = d3.scaleThreshold()
        .domain([30, 1529, 3953, 7978, 15343, 41002]) // Threshold breakpoints
        .range([0, 0.2, 0.7, 1, 1.2, 1.5, 0]);

    textureScales["bons"] = textureScale_2;

    const textureScale_3 = d3.scaleThreshold()
        .domain([0.45, 1, 1.28, 1.63, 2.59]) // Threshold breakpoints
        .range([0, 0.2, 0.7, 1, 1.2, 0]);

    textureScales["retencao"] = textureScale_3;

    const textureScale_4 = d3.scaleThreshold()
        .domain([-21.6, -20, -15, -10, -5, 0, 5, 10, 13.3]) // Threshold breakpoints
        .range([0, 0.2, 0.5, 0.7, 1, 1.2, 1.3, 1.5, 1.6, 0]);

    textureScales["variacao"] = textureScale_4;

    return textureScales;
}


//CRIA AS TEXTURAS -------------------------------------------------------
export function createTextures(m_svg) {
    //cria um array de largura dos quadrados para cada mapa
    let widths = new Set();

    //cria uma textura para cada largura
    Object.values(textureScales).forEach(scale => {
        scale.range().forEach(v => widths.add(v));
    });

    //cria uma textura para cada range
    [...widths].forEach(width => {

        //cria a textura default -> preta
        let black_texture = textures
            .paths()
            .d("squares")
            .size(4)
            .strokeWidth(width)
            .stroke("#000");

        //textura de hover no mapa -> amarela
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


//OBTÉM A TEXTURA --------------------------------------------------
export function getTexture(scale, value, highlight = false) {

    let width = scale(value);

    if (highlight) {
        return textureMapYellow[width].url();
    }

    return textureMapBlack[width].url();
}


// classifica corretamente com base nos thresholds
export function getClassIndex(scale, value) {
    let thresholds = scale.domain();

    for (let i = 0; i < thresholds.length; i++) {
        if (value <= thresholds[i]) return i;
    }

    return thresholds.length;
}


export function getTextureMapBlack() {
    return textureMapBlack;
}