import { ELECTRONICS_API, QUICK_LINKS_API, SLIDER_API } from "./constants/api.js";
import { DealItem, QuickLink, SliderItem } from "./constants/types.js";

// ---------------------
// QUICK LINKS FETCH
// ---------------------
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

// ---------------------
// MAIN SLIDER FETCH & SETUP
// ---------------------
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
    // Initialize indicator text
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

// ---------------------
// ELECTRONICS DEALS FETCH
// ---------------------
const fetchElectronicsDeals = async () => {
    try {
        const res = await fetch(ELECTRONICS_API);
        const data: DealItem[] = await res.json();
        const container = document.getElementById("electronics-slider");
        if (!container) return;

        // Clear the container
        container.innerHTML = "";

        // Get only the first 3 items to display
        const visible = data.slice(0, 3);

        visible.forEach(item => {
            const card = document.createElement("div");
            card.className = "deal-card";

            // Add coupon badge if available
            const couponBadge = item.couponText
                ? `<div class="coupon-badge">${item.couponText}</div>`
                : "";

            const stars = getStarsHTML(item.rating);
            const addToCartBtn = `<button class="add-to-cart">Sepete Ekle</button>`;

            card.innerHTML = `
              <div class="deal-card-image">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div class="deal-card-content">
                ${couponBadge}
                <h3>${item.title}</h3>
                <div class="stars">${stars}</div>
                <p>${item.price}</p>
                ${addToCartBtn}
              </div>
            `;

            const btn = card.querySelector(".add-to-cart");
            if (btn) {
                btn.addEventListener("click", () => {
                    console.log(`${item.title} added to cart!`);
                    alert(`${item.title} sepete eklendi!`);
                });
            }

            container.appendChild(card);
        });

        // Now that the cards are loaded, set up the electronics slider
        setupElectronicsSlider();
    } catch (err) {
        console.error("Electronics fetch error:", err);
    }
};

const getStarsHTML = (rating: number) => {
    const fullStars = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";

    for (let i = 0; i < fullStars; i++) html += "★";
    if (half) html += "½";
    while (html.length < 5) html += "☆";

    return html;
};

fetchElectronicsDeals();
function setupElectronicsSlider() {
    const sliderContainer = document.querySelector(".product-slider-container") as HTMLElement;
    const sliderTrack = document.getElementById("electronics-slider") as HTMLElement;
    const leftBtn = document.getElementById("product-slide-left") as HTMLButtonElement;
    const rightBtn = document.getElementById("product-slide-right") as HTMLButtonElement;

    const cards = Array.from(sliderTrack.children) as HTMLElement[];
    const totalCards = cards.length;

    let currentIndex = 0;

    const GAP = 12;

    function updateSliderButtons() {
        if (currentIndex === 0) {
            leftBtn.style.display = "none";
        } else {
            leftBtn.style.display = "block";
        }

    }


    function centerCard(index: number) {
        if (!sliderContainer || !sliderTrack || cards.length === 0) return;

        if (index === 0) {
            sliderTrack.style.transform = `translateX(0px)`;
            return;
        }

        const containerWidth = sliderContainer.getBoundingClientRect().width;
        const cardWidth = cards[index].getBoundingClientRect().width;
        const cardCenter = index * (cardWidth + GAP) + (cardWidth / 2);
        const offset = (containerWidth / 2) - cardCenter;
        sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    leftBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            centerCard(currentIndex);
            updateSliderButtons();
        }
    });

    rightBtn?.addEventListener("click", () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            centerCard(currentIndex);
            updateSliderButtons();
        }
    });

    centerCard(currentIndex);
    updateSliderButtons();
}
