let container = document.querySelector('.spaces_container');

// limites
let min_c = 3;//coluna
let max_c = 10;
let min_r = 3;//linha
let max_r = 6;

let v = Math.floor(Math.random() * 2);//escolhe aleatoriamente 0 ou 1

//desenha as retângulos
if (v == 0) {
    // LINHAS (topo e fundo)
    let rowLimits = limits(min_c, max_c);
    createRect(container, 'row', -rowLimits.start, -rowLimits.end, 1);
    createRect(container, 'row', rowLimits.start, rowLimits.end, 8);
} else if (v == 1) {
    // COLUNAS (laterais)
    let colLimits = limits(min_r, max_r);
    createRect(container, 'col', -colLimits.start, -colLimits.end, 1);
    createRect(container, 'col', colLimits.start, colLimits.end, 12);
}


function createRect(container, type, start, end, fixed) {
    let rect = document.createElement('div');//cria o retangulo

    rect.style.backgroundColor = '#F7F2EA';

    if (type == 'row') {
        rect.style.height = '6.5vh';
        rect.style.gridColumn = `${start} / ${end}`;
        rect.style.gridRow = fixed;
    } else if (type == 'col') {
        rect.style.width = '6.5vh';
        rect.style.gridColumn = fixed;
        rect.style.gridRow = `${start} / ${end}`;
    }

    container.appendChild(rect);
}


//Define os limites -> largura/altura dos retângulos
function limits(min, max) {
    let start = Math.floor(Math.random() * (max - min)) + min;
    let end = Math.floor(Math.random() * (max - start)) + start + 1;

    return { start, end };
}