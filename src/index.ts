type QuickLink = {
    title: string;
};

const QUICK_LINKS_API = "https://run.mocky.io/v3/5b33545a-cd3d-4a1f-869c-343a7f7b8ca1";

const fetchQuickLinks = async () => {
    try {
        const res = await fetch(QUICK_LINKS_API);
        const data: QuickLink[] = await res.json();

        const container = document.getElementById("quick-links");
        if (!container) return;

        data.forEach((item) => {
            const card = document.createElement("div");
            card.className = "quick-link-card";
            card.textContent = item.title;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Quick Links fetch error:", err);
    }
};

fetchQuickLinks();