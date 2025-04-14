import {QUICK_LINKS_API, SLIDER_API} from "./constants/api.js";
import {QuickLink, SliderItem} from "./constants/types.js";

const fetchQuickLinks = async () => {
    try {
        const res = await fetch(QUICK_LINKS_API);
        const data: QuickLink[] = await res.json();
        const container = document.getElementById("quick-links");
        if (!container) return;

        data.forEach((item) => {
            const card = document.createElement("div");
            card.className = "quick-link-card";

            card.innerHTML = `
        <div class="card-top">${item.topText}</div>
        <div class="card-title">${item.title}</div>
        <div class="card-category">${item.category}</div>
      `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Quick Links fetch error:", err);
    }
};

fetchQuickLinks();




let currentSlide = 0;
let totalSlides = 0;


const fetchMainSlider = async () => {
    try {
        const res = await fetch(SLIDER_API);
        const data: SliderItem[] = await res.json();
        const track = document.getElementById("main-slider");
        if (!track) return;

        totalSlides = data.length;

        data.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "slider-item";
            if (index === 0) div.classList.add("active");

            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
            `;
            track.appendChild(div);
        });

        setupSliderControls();
    } catch (err) {
        console.error("Slider fetch error:", err);
    }
    document.getElementById("slide-indicator")!.textContent = `1 / ${totalSlides}`;

};

const setupSliderControls = () => {
    const track = document.getElementById("main-slider")!;
    const leftBtn = document.getElementById("slide-left")!;
    const rightBtn = document.getElementById("slide-right")!;

    const goToSlide = (index: number) => {
        const slides = Array.from(track.children);
        slides.forEach(slide => slide.classList.remove("active"));
        if (slides[index]) slides[index].classList.add("active");
        track.style.transform = `translateX(-${index * 100}%)`;

        // update indicator
        const indicator = document.getElementById("slide-indicator");
        if (indicator) {
            indicator.textContent = `${index + 1} / ${totalSlides}`;
        }
    };


    leftBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    });

    rightBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    });
};



fetchMainSlider();
