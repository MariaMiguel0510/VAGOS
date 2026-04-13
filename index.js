
//ABOUT + ARCHIVE ---------------
let about_title = document.getElementById('about_title');
let about_container = document.querySelector('.about');
let archive_title = document.getElementById('archive_title');
let archive_container = document.querySelector('.archive');

//CONTENT DOTS ------------------
let dots = document.querySelectorAll('.dots a');
let dots_container = document.querySelectorAll('.dots');

window.addEventListener('scroll', () => {
    // limpar todos
    dots.forEach(dot => dot.style.backgroundColor = "");

    if (window.scrollY < window.innerHeight - 95) {
        dots.style.backgroundColor = "#FDF7EE";
    } else if (window.scrollY < (2 * window.innerHeight) - 95) {
        dots[0].style.backgroundColor = "black";
    } else if (window.scrollY < (3 * window.innerHeight) - 95) {
        dots[1].style.backgroundColor = "black";
    } else {
        dots[2].style.backgroundColor = "black";
    }
});

//OPEN/CLOSE ABOUT/ARCHIVE
toggle(archive_title, archive_container, '100vw', '0vw', true);//arquivo
toggle(about_title, about_container, '-100vw', '0vw', false);//sobre

//abrir e fechar páginas
function toggle(page, container, openValue, closedValue, move_left) {
    let isOpen = true; // estado inicial

    if (move_left == true) {//se tiver escondido para a direita
        container.style.transition = 'left 0.9s ease';
    } else {
        container.style.transition = 'right 0.9s ease';
    }

    page.addEventListener('click', function () {
        if (isOpen) {
            if (move_left == true) {
                container.style.left = closedValue;
            } else {
                container.style.right = closedValue;
            }
            lockScroll(true);
        } else {
            if (move_left == true) {
                container.style.left = openValue;
            } else {
                container.style.right = openValue;
            }
            lockScroll(false);//bloqueia o scroll
        }

        //alterna o estado
        isOpen = !isOpen;
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