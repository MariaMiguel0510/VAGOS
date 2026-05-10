//CONTENT DOTS ------------------------

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

