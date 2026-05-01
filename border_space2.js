let container = document.querySelector('.spaces_container');

space_container(container, 'div');


function space_container(selected, name) {
    let rect = document.createElement(name);

    let min = 3;
    let max = 10;

    let start = Math.floor(Math.random() * (max - min)) + min;
    let end = Math.floor(Math.random() * (max - start)) + start + 1;

    rect.style.height = '40px';
    rect.style.backgroundColor = '#F7F2EA';

    rect.style.gridColumn = `${start} / ${end}`;
    rect.style.gridRow = "6";

    selected.appendChild(rect);

    return rect;
}