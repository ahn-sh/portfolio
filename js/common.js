/* ========================================
   Common Interaction
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTopButton();
});


/* ========================================
   Top Button
======================================== */

function initTopButton() {
    const topButton =
        document.querySelector(".top-button");

    if (!topButton) return;

    function toggleTopButton() {
        topButton.classList.toggle(
            "is-visible",
            window.scrollY > 400
        );
    }

    window.addEventListener(
        "scroll",
        toggleTopButton,
        { passive: true }
    );

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    toggleTopButton();
}