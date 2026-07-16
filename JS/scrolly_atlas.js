import { draw_map } from "./draw_atlas.js";
import { updateMap } from "./draw_atlas.js";


let atlas = document.querySelector(".atlas");
let steps = document.querySelectorAll(".atlas .step");

let scroller = scrollama();

function handleStepEnter(response) {

    steps.forEach(s => s.classList.remove("is-active"));
    response.element.classList.add("is-active");
    //console.log(response.index);

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


//SNAP SCROLL EFFECT
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


//FADE-IN / FADE-OUT EFFECT
//verifica quando os elementos entrem e saem da viewport
const observer = new IntersectionObserver(

    //sempre que algum dos elementos entra/sai da viewport
    (entries) => {
        entries.forEach(entry => {

            //verifica se está visível
            if (entry.isIntersecting) {
                entry.target.classList.add("text-visible");
            } else {
                entry.target.classList.remove("text-visible");
            }
        });
    },
    {
        threshold: 0.25
    });

document
    .querySelectorAll(".step_title, .step_subtitle, .step_text")
    .forEach(el => observer.observe(el));