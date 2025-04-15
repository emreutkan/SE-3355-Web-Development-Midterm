import { ELECTRONICS_API, QUICK_LINKS_API, RECOMMENDED_API, SLIDER_API } from "./constants/api.js";
import { DealItem, QuickLink, RecommendedItem, SliderItem } from "./constants/types.js";

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

            div.innerHTML = `<img src="${item.image}" alt="${item.title}" />`;
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

        const indicator = document.getElementById("slide-indicator");
        if (indicator) indicator.textContent = `${index + 1} / ${totalSlides}`;
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

        container.innerHTML = "";
        const visible = data.slice(0, 3);

        visible.forEach(item => {
            const card = document.createElement("div");
            card.className = "deal-card";

            const couponBadge = item.couponText
                ? `<div class="coupon-badge">${item.couponText}</div>`
                : "";

            const stars = getStars(item.rating);
            const addToCartBtn = `<button class="add-to-cart">Sepete Ekle</button>`;

            card.innerHTML = `
              <div class="deal-card-image">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div class="deal-card-content">
                ${couponBadge}
                <h3>${item.title}</h3>
                <div class="star-review">
                    ${stars}
                </div>
                <p>${item.price}</p>
                ${addToCartBtn}
              </div>
            `;

            card.querySelector(".add-to-cart")?.addEventListener("click", () => {
                alert(`${item.title} sepete eklendi!`);
            });

            container.appendChild(card);
        });

        setupElectronicsSlider();
    } catch (err) {
        console.error("Electronics fetch error:", err);
    }
};

const getStars = (rating: number): string => {
    const percentage = (Math.round(rating * 2) / 2) * 20;
    return `<span class="stars" style="--rating-width: ${percentage}%"></span>`;
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

    const updateSliderButtons = () => {
        leftBtn.style.display = currentIndex === 0 ? "none" : "block";
    };

    const centerCard = (index: number) => {
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
    };

    leftBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            centerCard(currentIndex);
            updateSliderButtons();
        }
    });

    rightBtn.addEventListener("click", () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            centerCard(currentIndex);
            updateSliderButtons();
        }
    });

    centerCard(currentIndex);
    updateSliderButtons();
}

// ---------------------
// RECOMMENDED PRODUCTS
// ---------------------
const FAVORITES_KEY = "recommendedFavorites";

const fetchRecommended = async () => {
    try {
        const res = await fetch(RECOMMENDED_API);
        const data: RecommendedItem[] = await res.json();
        renderRecommended(data);
    } catch (err) {
        console.error("Recommended fetch error:", err);
    }
};

const renderRecommended = (items: RecommendedItem[]) => {
    const container = document.getElementById("recommended-section");
    if (!container) return;

    const title = document.createElement("h2");
    title.className = "recommended-title";
    title.textContent = "sana özel öneriler";

    const wrapper = document.createElement("div");
    wrapper.className = "recommended-list";

    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "recommended-card";

        card.innerHTML = `
    <div class="recommended-img-wrapper">
        <img src="${item.img}" alt="${item.title}">
        <button class="favorite-btn">${favorites.includes(item.id) ? "♥" : "♡"}</button>
        ${item.label ? `<div class="label-badge">${item.label.replace(/\n/g, "<br>")}</div>` : ""}
    </div>
    <div class="recommended-info">
        ${item.paymentNote ? `<div class="payment-note">${item.paymentNote}</div>` : ""}
        <p class="product-name">${item.title}</p>
        <div class="star-review">
            ${getStars(item.rating)}
            <span class="review-count">(${item.votes})</span>
        </div>
        ${
            item.oldPrice
                ? `<div><span class="old-price">${item.oldPrice}</span><span class="discount">%${getDiscount(item.oldPrice, item.discountedPrice)} indirim</span></div>`
                : ""
        }
        <p class="product-price">${item.discountedPrice}</p>
    </div>
    <button class="add-cart-btn">Sepete Ekle</button>
`;

        const favBtn = card.querySelector(".favorite-btn")!;
        favBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = favorites.indexOf(item.id);
            if (index > -1) {
                favorites.splice(index, 1);
                favBtn.textContent = "♡";
            } else {
                favorites.push(item.id);
                favBtn.textContent = "♥";
            }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        });

        wrapper.appendChild(card);
    });

    container.append(title, wrapper);
};

const getDiscount = (oldPrice: string, newPrice: string): number => {
    const oldNum = parseFloat(oldPrice.replace(",", ".").replace(" TL", "").replace(".", "").trim());
    const newNum = parseFloat(newPrice.replace(",", ".").replace(" TL", "").replace(".", "").trim());
    return Math.round(((oldNum - newNum) / oldNum) * 100);
};

fetchRecommended();
