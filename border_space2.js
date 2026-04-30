let container = document.querySelector('.teste');
let colunas = 8;//nº total de colunas existentes

space_container(container, 'div', colunas);


function space_container(selected, name, total) {
    let rect = document.createElement(name);

    let start = Math.floor(Math.random() * (total - 1)) + 1;//define coluna início
    let end = Math.floor(Math.random() * (total - start)) + start + 1;//define coluna fim

    rect.style.height = '40px';
    rect.style.backgroundColor = '#F7F2EA';
    rect.style.alignSelf = 'end';
    rect.style.zIndex = '10';

    //posição na grid
    rect.style.gridColumn = `${start} / ${end}`;

    //última linha
    rect.style.gridRow = "4";

    selected.appendChild(rect);

    return rect;
}