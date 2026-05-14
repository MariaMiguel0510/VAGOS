
//ABOUT + ARCHIVE ---------------
let open_about = document.getElementById('open_about');
let close_about = document.getElementById('close_about');
let about_container = document.querySelector('.about');

let open_archive = document.getElementById('open_archive');
let close_archive = document.getElementById('close_archive');
let archive_container = document.querySelector('.archive');

let landing_page = document.querySelector('.landing_page')

//OPEN/CLOSE ABOUT/ARCHIVE ---------------------------------------------------
toggleSection(open_about, close_about, about_container, 'right','100vw');//about
toggleSection(open_archive, close_archive, archive_container, 'left','-100vw');//archive

function toggleSection(openBtn, closeBtn, container, direction, landingMove) {
    //coloca a transicao de abertura universal
    container.style.transition = `${direction} 0.9s ease`;
    landing_page.style.transition = `left 0.9s ease`;

    // ABRIR
    openBtn.addEventListener('click', function () {
        container.style[direction] = '0vw';
        landing_page.style.left = landingMove;
        lockScroll(true);//bloqueia o scroll vertical
    });

    // FECHAR
    closeBtn.addEventListener('click', function () {
        container.style[direction] = '100vw';
        landing_page.style.left = '0vw';
        lockScroll(false);//ativa o scroll vertical
    });
}


//bloqueia o scroll
function lockScroll(lock) {
    if (lock) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden';
    }
}