import { ELECTRONICS_API, QUICK_LINKS_API, RECOMMENDED_API, SLIDER_API } from "./constants/api.js";

const fetchQuickLinks = async () => {
    try {
        const res = await fetch(QUICK_LINKS_API);
        const data = await res.json();
        const container = document.getElementById("quick-links");
        if (!container) return;

        data.forEach((item) => {
            const card = document.createElement("div");
            card.className = "quick-link-card";

            const anchor = document.createElement("a");
            anchor.href = item.forwardLink;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";

            anchor.innerHTML = `
                <img src="${item.image}" alt="Quick Link" class="quick-link-image" />
            `;

            card.appendChild(anchor);
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Quick Links fetch error:", err);
    }
};

fetchQuickLinks();

let currentSlide = 0;
let totalSlides = 0;
let sliderAutoPlayInterval;

const fetchMainSlider = async () => {
    try {
        const res = await fetch(SLIDER_API);
        const data = await res.json();
        const track = document.getElementById("main-slider");
        if (!track) return;

        totalSlides = data.length;

        data.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "slider-item";
            if (index === 0) div.classList.add("active");

            const anchor = document.createElement("a");
            anchor.href = item.forwardLink;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";

            anchor.innerHTML = `<img src="${item.image}" alt="${item.title}" />`;

            div.appendChild(anchor);
            track.appendChild(div);
        });

        setupSliderControls();
        startSliderAutoPlay();
    } catch (err) {
        console.error("Slider fetch error:", err);
    }

    document.getElementById("slide-indicator").textContent = `1 / ${totalSlides}`;
};

const setupSliderControls = () => {
    const track = document.getElementById("main-slider");
    const leftBtn = document.getElementById("slide-left");
    const rightBtn = document.getElementById("slide-right");

    const goToSlide = (index) => {
        currentSlide = index;
        const slides = Array.from(track.children);
        slides.forEach(slide => slide.classList.remove("active"));
        if (slides[index]) slides[index].classList.add("active");

        track.style.transform = `translateX(-${index * 100}%)`;

        const indicator = document.getElementById("slide-indicator");
        if (indicator) indicator.textContent = `${index + 1} / ${totalSlides}`;
    };

    leftBtn.addEventListener("click", () => {
        resetSliderAutoPlay();
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    });

    rightBtn.addEventListener("click", () => {
        resetSliderAutoPlay();
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    });

    window.goToNextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    };
};

const startSliderAutoPlay = () => {
    if (sliderAutoPlayInterval) {
        clearInterval(sliderAutoPlayInterval);
    }

    sliderAutoPlayInterval = setInterval(() => {
        if (typeof window.goToNextSlide === 'function') {
            window.goToNextSlide();
        }
    }, 3000);
};

const resetSliderAutoPlay = () => {
    if (sliderAutoPlayInterval) {
        clearInterval(sliderAutoPlayInterval);
    }
    startSliderAutoPlay();
};

fetchMainSlider();

let electronicsAutoPlayInterval;
let currentElectronicsIndex = 0;

const fetchElectronicsDeals = async () => {
    try {
        const res = await fetch(ELECTRONICS_API);
        const data = await res.json();
        const container = document.getElementById("electronics-slider");
        if (!container) return;

        container.innerHTML = "";

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "deal-card";

            const couponBadge = item.couponText
                ? `<div class="coupon-badge">${item.couponText}</div>`
                : "";

            const stars = getStars(item.rating);

            const reviewsInfo = item.reviews
                ? `<div class="reviews-info">${item.reviews} Değerlendirme</div>`
                : "";

            const cardContent = `
              <div class="deal-card-image">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div class="deal-card-content">
                ${couponBadge}
                <h3>${item.title}</h3>
                <div class="star-review">
                    ${stars}
                    <span class="review-count">${reviewsInfo}</span>
                </div>
                <p class="product-price">${item.price}</p>
                <button class="add-to-cart">Sepete Ekle</button>
              </div>
            `;

            if (item.forwardLink) {
                const wrapper = document.createElement("a");
                wrapper.href = item.forwardLink;
                wrapper.target = "_blank";
                wrapper.rel = "noopener noreferrer";
                wrapper.style.textDecoration = "none";
                wrapper.style.color = "inherit";
                wrapper.style.display = "flex";
                wrapper.style.width = "100%";
                wrapper.style.height = "100%";
                wrapper.innerHTML = cardContent;

                const addToCartBtn = wrapper.querySelector(".add-to-cart");
                if (addToCartBtn) {
                    addToCartBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`${item.title} sepete eklendi!`);
                    });
                }

                card.appendChild(wrapper);
            } else {
                card.innerHTML = cardContent;
                const addToCartBtn = card.querySelector(".add-to-cart");
                if (addToCartBtn) {
                    addToCartBtn.addEventListener("click", () => {
                        alert(`${item.title} sepete eklendi!`);
                    });
                }
            }

            container.appendChild(card);
        });

        setupElectronicsSlider();
        startElectronicsAutoPlay();
    } catch (err) {
        console.error("Electronics fetch error:", err);
    }
};

const getStars = (rating) => {
    const percentage = (Math.round(rating * 2) / 2) * 20;
    return `<span class="stars" style="--rating-width: ${percentage}%"></span>`;
};

fetchElectronicsDeals();

function setupElectronicsSlider() {
    const sliderContainer = document.querySelector(".product-slider-container");
    const sliderTrack = document.getElementById("electronics-slider");
    const leftBtn = document.getElementById("product-slide-left");
    const rightBtn = document.getElementById("product-slide-right");

    const cards = Array.from(sliderTrack.children);
    const totalCards = cards.length;

    if (totalCards === 0) return;

    currentElectronicsIndex = 0;
    const GAP = 12;

    const updateSliderButtons = () => {
        leftBtn.style.display = currentElectronicsIndex === 0 ? "none" : "block";
        rightBtn.style.display = "block";
    };

    const goToCard = (index) => {
        if (!sliderContainer || !sliderTrack || cards.length === 0) return;

        currentElectronicsIndex = (index + totalCards) % totalCards;

        if (currentElectronicsIndex === 0) {
            sliderTrack.style.transform = `translateX(0px)`;
        } else {
            const containerWidth = sliderContainer.getBoundingClientRect().width;
            const cardWidth = cards[0].getBoundingClientRect().width;
            const cardCenter = currentElectronicsIndex * (cardWidth + GAP) + (cardWidth / 2);
            const offset = (containerWidth / 2) - cardCenter;
            sliderTrack.style.transform = `translateX(${offset}px)`;
        }

        updateSliderButtons();

        resetElectronicsAutoPlay();
    };

    leftBtn.addEventListener("click", () => {
        goToCard(currentElectronicsIndex - 1);
    });

    rightBtn.addEventListener("click", () => {
        goToCard(currentElectronicsIndex + 1);
    });

    goToCard(0);

    updateSliderButtons();

    window.goToNextElectronicsCard = () => {
        goToCard(currentElectronicsIndex + 1);
    };
}

const startElectronicsAutoPlay = () => {
    if (electronicsAutoPlayInterval) {
        clearInterval(electronicsAutoPlayInterval);
    }

    electronicsAutoPlayInterval = setInterval(() => {
        if (typeof window.goToNextElectronicsCard === 'function') {
            window.goToNextElectronicsCard();
        }
    }, 3000);
};

const resetElectronicsAutoPlay = () => {
    if (electronicsAutoPlayInterval) {
        clearInterval(electronicsAutoPlayInterval);
    }
    startElectronicsAutoPlay();
};

const FAVORITES_KEY = "recommendedFavorites";

const fetchRecommended = async () => {
    try {
        const res = await fetch(RECOMMENDED_API);
        const data = await res.json();
        renderRecommended(data);
    } catch (err) {
        console.error("Recommended fetch error:", err);
    }
};

const renderRecommended = (items) => {
    const wrapper = document.getElementById("recommended-slider");
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

    wrapper.innerHTML = "";
    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "recommended-card";

        const cardHTML = `
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
                ${item.cartPrice ? `<p class="cart-price">${item.cartPrice}</p>` : ""}
                ${item.extra ? `<p class="extra-info">${item.extra}</p>` : ""}
            </div>
            <button class="add-cart-btn">Sepete Ekle</button>
        `;

        if (item.forwardLink) {
            const wrapper = document.createElement("a");
            wrapper.href = item.forwardLink;
            wrapper.target = "_blank";
            wrapper.rel = "noopener noreferrer";
            wrapper.style.textDecoration = "none";
            wrapper.style.color = "inherit";
            wrapper.style.display = "block";
            wrapper.style.height = "100%";
            wrapper.innerHTML = cardHTML;

            card.appendChild(wrapper);

            const favBtn = card.querySelector(".favorite-btn");
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

            const addCartBtn = card.querySelector(".add-cart-btn");
            addCartBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                alert(`${item.title} sepete eklendi!`);
            });
        } else {
            card.innerHTML = cardHTML;

            const favBtn = card.querySelector(".favorite-btn");
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

            const addCartBtn = card.querySelector(".add-cart-btn");
            addCartBtn.addEventListener("click", () => {
                alert(`${item.title} sepete eklendi!`);
            });
        }

        wrapper.appendChild(card);
    });

    setupRecommendedSlider();
};

function setupRecommendedSlider() {
    const container = document.getElementById("recommended-slider");
    const leftBtn = document.getElementById("recommended-left");
    const rightBtn = document.getElementById("recommended-right");
    const cards = Array.from(container.getElementsByClassName("recommended-card"));

    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 20;
    const visibleCount = 6;
    let currentIndex = 0;

    leftBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex = Math.max(currentIndex - visibleCount, 0);
            container.scrollTo({ left: currentIndex * cardWidth, behavior: "smooth" });
        } else {
            currentIndex = 0;
            container.scrollTo({ left: 0, behavior: "smooth" });
        }
    });

    rightBtn.addEventListener("click", () => {
        const maxIndex = cards.length - visibleCount;
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(currentIndex + visibleCount, maxIndex);
            container.scrollTo({ left: currentIndex * cardWidth, behavior: "smooth" });
        } else {
            currentIndex = 0;
            container.scrollTo({ left: 0, behavior: "smooth" });
        }
    });
}

const getDiscount = (oldPrice, newPrice) => {
    const oldNum = parseFloat(oldPrice.replace(",", ".").replace(" TL", "").replace(".", "").trim());
    const newNum = parseFloat(newPrice.replace(",", ".").replace(" TL", "").replace(".", "").trim());
    return Math.round(((oldNum - newNum) / oldNum) * 100);
};

fetchRecommended();