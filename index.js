
//ABOUT + ARCHIVE ---------------
let open_about = document.getElementById('open_about');
let close_about = document.getElementById('close_about');
let about_container = document.querySelector('.about');
let more = document.getElementById('more');
let less = document.getElementById('less');
let about_text = document.querySelector('.about_text');

let open_archive = document.getElementById('open_archive');
let close_archive = document.getElementById('close_archive');
let archive_container = document.querySelector('.archive');


//CONTENT DOTS ------------------
let dots = document.querySelectorAll('.dots a');
let dots_container = document.querySelectorAll('.dots');

window.addEventListener('scroll', () => {
    // limpar todos
    dots.forEach(dot => dot.style.backgroundColor = "");

    if (window.scrollY < window.innerHeight - 95) {
        dots[0].style.backgroundColor = "#FDF7EE";
        dots[1].style.backgroundColor = "#FDF7EE";
        dots[2].style.backgroundColor = "#FDF7EE";
    } else if (window.scrollY < (2 * window.innerHeight) - 95) {
        dots[0].style.backgroundColor = "black";
    } else if (window.scrollY < (3 * window.innerHeight) - 95) {
        dots[1].style.backgroundColor = "black";
    } else {
        dots[2].style.backgroundColor = "black";
    }
});

//OPEN/CLOSE ABOUT/ARCHIVE ---------------------------------------------------
toggle(open_archive, close_archive, archive_container, '100vw', '0vw', false);//arquivo
toggle(open_about, close_about, about_container, '100vw', '0vw', true);//sobre

function toggle(openBtn, closeBtn, container, hiddenPosition, visiblePosition, itsabout) {

    if (itsabout == false) {//se for o arqchive
        container.style.transition = 'left 0.9s ease';
    } else {
        container.style.transition = 'right 0.9s ease';
    }

    // ABRIR
    openBtn.addEventListener('click', function () {
        if (itsabout == false) {//se for o archive
            container.style.left = visiblePosition;
        } else {
            container.style.right = visiblePosition;
        }
        lockScroll(true);
    });

    // FECHAR
    closeBtn.addEventListener('click', function () {
        if (itsabout == false) {//se for o archive
            container.style.left = hiddenPosition;
        } else {
            container.style.right = hiddenPosition;
        }
        lockScroll(false);
    });
}

//bloqueia o scroll
function lockScroll(lock) {
    if (lock) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

//ABOUT VER MAIS -------------------------------------------------------

toggleBtn(more, true);
toggleBtn(less, false);

function toggleBtn(botao, show) {
    botao.addEventListener('click', function () {
        if (show === true) { //mostra mais informação
            more.style.display = "none";
            less.style.display = "block";
            about_text.style.overflow = "auto";
            about_text.style.height = "25vh";
        } else { //mostra menos
            more.style.display = "block";
            less.style.display = "none";
            about_text.style.overflow = "hidden";
            about_text.style.height = "16vh";
        }
    });
}
