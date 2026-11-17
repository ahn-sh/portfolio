/* ========================================
   Common Interaction
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTopButton();
    initCopyright();
    initPageProtection();
});


/* ========================================
   Page Protection
======================================== */

function initPageProtection() {

    // 우클릭 메뉴 차단
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    // 드래그 시작 차단
    document.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });

    // 개발자도구 및 소스 보기 단축키 제한
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        // F12
        if (key === "f12") {
            e.preventDefault();
            return;
        }

        // Ctrl + Shift + I / J / C
        if (
            e.ctrlKey &&
            e.shiftKey &&
            ["i", "j", "c"].includes(key)
        ) {
            e.preventDefault();
            return;
        }

        // Ctrl + U (소스 보기)
        if (e.ctrlKey && key === "u") {
            e.preventDefault();
            return;
        }

        // Mac 개발자도구 단축키
        if (
            e.metaKey &&
            e.altKey &&
            ["i", "j", "c", "u"].includes(key)
        ) {
            e.preventDefault();
        }
    });

}


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


/* ========================================
   Copyright
======================================== */

function initCopyright() {
    const year =
        document.getElementById("copyright-year");

    if (!year) return;

    year.textContent = new Date().getFullYear();
}