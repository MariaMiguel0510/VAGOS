/*este ficheiro é dedicado apenas à landing*/

let dots = document.querySelector(".dots");
let dots_trigger = document.querySelector(".dots_trigger");


let dots_observer = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) {
            // passou acima do trigger → fixa
            dots.classList.add("fixed");
        } else {
            // ainda abaixo → volta ao normal
            dots.classList.remove("fixed");
        }
    },
    {
        threshold: 0
    }
);

dots_observer.observe(dots_trigger);

