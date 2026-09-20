/*este ficheiro é dedicado aos botões que surgem durante o website*/

//ABOUT + ARCHIVE ---------------
let open_about = document.getElementById('open_about');
let close_about = document.getElementById('close_about');
let about_container = document.querySelector('.about');

let open_archive = document.getElementById('open_archive');
let close_archive = document.getElementById('close_archive');
let archive_container = document.querySelector('.archive');

let landing_page = document.querySelector('.landing_page')

//MAP DOWNLOAD --------------------
let save_atlas = document.querySelector(".download");
let atlas_container = document.querySelector(".atlas_grid_container");


//OPEN/CLOSE ABOUT/ARCHIVE ---------------------------------------------------
toggleSection(open_about, open_archive, close_about, about_container, 'right', '100vw');//about
toggleSection(open_archive, open_about, close_archive, archive_container, 'left', '-100vw');//archive
/*
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
}*/

function toggleSection(openBtn, oppositeBtn, closeBtn, container, direction, landingMove) {

    // transições
    container.style.transition = `${direction} 0.9s ease`;
    landing_page.style.transition = `left 0.9s ease`;


    // ABRIR
    openBtn.addEventListener('click', function () {

        // abre a secção
        container.style[direction] = '0vw';
        landing_page.style.left = landingMove;

        // botão da secção aberta fica amarelo
        openBtn.style.color = '#FFD700';

        // botão oposto volta a preto
        oppositeBtn.style.color = 'black';

        // bloqueia o scroll
        lockScroll(true);
    });


    // FECHAR
    closeBtn.addEventListener('click', function () {

        // fecha a secção
        container.style[direction] = '100vw';
        landing_page.style.left = '0vw';

        // ambos os botões voltam a preto
        openBtn.style.color = 'black';
        oppositeBtn.style.color = 'black';

        // ativa o scroll
        lockScroll(false);
    });
}



//bloqueia o scroll no about e no archive
function lockScroll(lock) {
    //se estiver na versão desktop
    if (window.innerWidth > 850) {
        if (lock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
        }
    }
}


//FAZ DOWNLOAD DO MAPA/ATLAS E DA LEGENDA
save_atlas.addEventListener('click', async function () {

    //tira um print do contentor
    let canvas = await html2canvas(atlas_container, { "logging": false, "backgroundColor": null, "scale": 3 });
    let link = document.createElement('a');

    link.download = 'atlas.png';
    link.href = canvas.toDataURL('image/png');

    link.click();
});
