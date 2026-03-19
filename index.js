let about_title = document.getElementById('about_title');
let about_container = document.querySelector('.about');
let archive_title = document.getElementById('archive_title');
let archive_container = document.querySelector('.archive');



let isOpen = false; // estado inicial

function toggle(page, container, openValue, closedValue) {
    page.addEventListener('click', function () {
        // Define o valor de 'left' baseado no estado atual
        container.style.left = isOpen ? closedValue : openValue;

        // Para animação suave
        container.style.transition = 'left 0.9s ease';

        // Alterna o estado
        isOpen = !isOpen;
    });
}

toggle(archive_title, archive_container,  '100vw', '0vw');