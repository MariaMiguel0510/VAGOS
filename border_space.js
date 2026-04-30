
let container = document.querySelector('.about');

let min = 8;
let max = 40; 
let randomLeft = Math.floor(Math.random() * (max - min + 1)) + min + 'vw';
let randomRight = Math.floor(Math.random() * (max - min + 1)) + min + 'vw';

space_container(container, 'div');
//console.log(rect_width);

//place where its created, what it created
function space_container(selected, name) {
    let rect = document.createElement(name);

    selected.appendChild(rect);
    rect.style.height = '40px';
    rect.style.position = 'absolute';
    rect.style.bottom = '0';
    rect.style.backgroundColor = '#F7F2EA';
    rect.style.padding = '0';
    rect.style.margin = '0';
    rect.style.left = randomLeft;
    rect.style.right = '40vw';
    rect.style.boxSizing = 'border-box';

    return rect;
}
