
let about_title = document.getElementById('about_title');
let about_container = document.querySelector('.about');
let archive_title = document.getElementById('archive_title');
let archive_container = document.querySelector('.archive');
let landing_page_container = document.querySelector('.landing_page');
let content_container = document.querySelector('.content');

let visible = false;

//abrir e fechar páginas
function toggle(page, container, openValue, closedValue) {
    let isOpen = false; // estado inicial
    page.addEventListener('click', function () {
        //define o valor de 'left' baseado no estado atual
        if (isOpen) {
            container.style.left = closedValue;
            page.style.zIndex = 5; //texto fica por cima
        } else {
            container.style.left = openValue;
            page.style.zIndex = 0; //texto fica por baixo
        }
        container.style.transition = 'left 0.9s ease';

        //alterna o estado
        isOpen = !isOpen;
    });
}

toggle(archive_title, archive_container, '100vw', '0vw');//arquivo
toggle(about_title, about_container, '-100vw', '0vw');//sobre*/
