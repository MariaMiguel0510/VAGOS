import { draw_map } from "./draw_atlas.js";
import { updateMap } from "./draw_atlas.js";


let atlas = document.querySelector(".atlas");
let steps = document.querySelectorAll(".atlas .step");

let scroller = scrollama();

function handleStepEnter(response) {

    steps.forEach(s => s.classList.remove("is-active"));
    response.element.classList.add("is-active");
    console.log(response.index);

    updateMap(response.index);
}

function init() {

    scroller
        .setup({
            step: ".atlas .step",
            offset: 0.5,
            //debug: true //permite ver as linhas que acionam o trigger scrolly
        })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", scroller.resize);
}

init();


//permite criar o efeito de snap scroll dentro do scrollytelling
window.addEventListener("scroll", () => {

    //obtém a posição do atlas para verificar os limites top/bottom
    let rect = atlas.getBoundingClientRect();

    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        document.documentElement.classList.add("snap-mode");
    } else {
        document.documentElement.classList.remove("snap-mode");
    }
});