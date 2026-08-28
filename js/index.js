/* ========================================
   Work Grid
======================================== */

const workGrid = document.getElementById("workGrid");

if (workGrid) {
    const cards = Array.from(
        workGrid.querySelectorAll(".work-card")
    );

    cards.sort((a, b) => {
        const yearDiff =
            Number(b.dataset.year) - Number(a.dataset.year);

        if (yearDiff !== 0) {
            return yearDiff;
        }

        return Number(a.dataset.order) - Number(b.dataset.order);
    });

    cards.forEach((card) => {
        workGrid.appendChild(card);
    });
}