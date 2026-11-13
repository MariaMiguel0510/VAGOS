import { loadAtlasData } from "./data_atlas.js"; //carrega os dados
import { draw_map, updateMap, setStepData } from "./draw_atlas.js"; //desenha e atualiza o mapa
import { createSteps } from "./step_atlas.js"; //cria os passos


// carrega os dados do mapa e cria os steps em paralelo
Promise.all([
    loadAtlasData(),
    createSteps()
]).then(([[geojson, csvData], groupedData]) => {

    //envia os dados dos steps para o draw_atlas.js
    setStepData(groupedData);

    //envia os dados geográficos e estatísticos para desenhar o mapa
    draw_map(geojson, csvData);


    let atlas = document.querySelector(".atlas");
    let steps = document.querySelectorAll(".atlas .step");

    let scroller = scrollama();

    function handleStepEnter(response) {
        steps.forEach(s => s.classList.remove("is-active"));
        response.element.classList.add("is-active");

        let stepId = response.element.dataset.step;
        updateMap(stepId);//corresponde ao identificador real do passo definido no csv
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

}).catch(error => {
    //permite receber uma indicação de erro caso um ficheiro não carregue
    console.error("Erro ao carregar os dados do atlas:", error);
});