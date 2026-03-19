/*
let about_title = document.getElementById('about_title');
let about_container = document.querySelector('.about');
let archive_title = document.getElementById('archive_title');
let archive_container = document.querySelector('.archive');

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

const aboutContainer = document.querySelector('.about');
const archiveContainer = document.querySelector('.archive');

// posição atual das páginas
let aboutPos = -100;   // em vw
let archivePos = 100;  // em vw

document.addEventListener('wheel', (e) => {
    // scroll horizontal com Shift ou baseado no deltaX
    if (e.deltaX !== 0 || e.shiftKey) {
       // e.preventDefault(); // impede scroll horizontal padrão

        // scroll para esquerda -> mostra about
        if (e.deltaY < 0 || e.deltaX < 0) {
            aboutPos = Math.min(0, aboutPos + 10); // move para dentro
            aboutContainer.style.left = aboutPos + 'vw';
        }

        // scroll para direita -> mostra archive
        if (e.deltaY > 0 || e.deltaX > 0) {
            archivePos = Math.max(0, archivePos - 10); // move para dentro
            archiveContainer.style.left = archivePos + 'vw';
        }

        // animação suave
        aboutContainer.style.transition = 'left 0.9s ease';
        archiveContainer.style.transition = 'left 0.9s ease';
    }
});