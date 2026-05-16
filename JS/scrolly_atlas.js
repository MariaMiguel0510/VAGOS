import { draw_map } from "./draw_atlas.js";
import { updateMap } from "./draw_atlas.js";

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
            offset: 0.4,
            //debug: true //permite ver as linhas que acionam o trigger scrolly
        })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", scroller.resize);
}

init();