
const QUICK_LINKS_API = "https://run.mocky.io/v3/d3d75ffd-97a5-4ea5-9824-91c60faa72d8";

// [
//     { "topText": "Bu Fiyatlar Kaçmaz", "title": "Elektronik", "category": "Elektronik" },
//     { "topText": "Fırsatlarla Dolu", "title": "Çeyiz ALIŞVERİŞİ", "category": "Alışverişe Başla" },
//     { "topText": "Kredi Limitini Gör", "title": "%0'DAN BAŞLAYAN FAİZ", "category": "Hepsipay" },
//     { "topText": "İndirimli Fiyatlar", "title": "DÖRT DÖRTLÜK FIRSATLAR", "category": "Alışverişe Başla" },
//     { "topText": "Fırsatları Keşfet", "title": "ALIŞVERİŞİN TOP LİSTESİ", "category": "Sevilen Ürünler" },
//     { "topText": "Her Pazar Fırsat Var", "title": "NET İNDİRİM PAZARI", "category": "Sakın Kaçırma" },
//     { "topText": "Aradığın Fırsatlar", "title": "Ev Elektroniği", "category": "Elektronik" },
//     { "topText": "Büyük İndirim", "title": "OYUNCAK GÜNLERİ", "category": "Sevilen Oyuncaklar" }
// ]

type QuickLink = {
    topText: string;
    title: string;
    category: string;
};


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
