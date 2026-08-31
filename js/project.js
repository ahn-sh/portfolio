/* ========================================
   Project Interaction
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initReveal();
    initParallax();
    initScrollUI();
    initBackButton();

    initStrategy();
});


/* ========================================
   Smooth Scroll
======================================== */

function initSmoothScroll() {
    const buttons = document.querySelectorAll(
        "[data-scroll-target]"
    );

    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selector = button.dataset.scrollTarget;
            const target = document.querySelector(selector);

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* ========================================
   Reveal
======================================== */

function initReveal() {
    const elements = document.querySelectorAll(
        "[data-reveal]"
    );

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;

                const delay = Number(
                    element.dataset.revealDelay || 0
                );

                window.setTimeout(() => {
                    element.classList.add("is-visible");
                }, delay);

                observer.unobserve(element);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* ========================================
   Parallax
======================================== */

function initParallax() {
    const elements = document.querySelectorAll(
        "[data-parallax]"
    );

    if (!elements.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let ticking = false;

    function update() {
        const viewportHeight = window.innerHeight;

        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }

            const speed = Number(
                element.dataset.parallax || 0
            );

            const center =
                rect.top + rect.height / 2;

            const viewportCenter =
                viewportHeight / 2;

            const distance =
                center - viewportCenter;

            const offset =
                distance * speed;

            element.style.transform =
                `translate3d(0, ${offset}px, 0)`;
        });

        ticking = false;
    }

    function requestUpdate() {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(update);
    }

    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate
    );

    update();
}


/* ========================================
   Scroll UI
   - Sub Header
   - Top Button
======================================== */

function initScrollUI() {
    const subHeader =
        document.querySelector(".sub-header");

    const topButton =
        document.querySelector(".top-button");

    if (!subHeader && !topButton) return;


    /* 현재 페이지의 실제 스크롤 위치 */
    function getScrollTop() {
        const project =
            document.querySelector(".project");

        const main =
            document.querySelector("main");

        return Math.max(
            window.scrollY || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0,
            project ? project.scrollTop : 0,
            main ? main.scrollTop : 0
        );
    }


    function updateScrollUI() {
        const scrollTop = getScrollTop();


        /* Header */
        if (subHeader) {
            subHeader.classList.toggle(
                "is-scrolled",
                scrollTop > 40
            );
        }


        /* Top Button */
        if (topButton) {
            topButton.classList.toggle(
                "is-visible",
                scrollTop > 400
            );
        }
    }


    /*
       window뿐 아니라
       내부 scroll container의 scroll도 감지
    */
    window.addEventListener(
        "scroll",
        updateScrollUI,
        { passive: true }
    );

    document.addEventListener(
        "scroll",
        updateScrollUI,
        {
            passive: true,
            capture: true
        }
    );


    /* Resize 후에도 상태 재확인 */
    window.addEventListener(
        "resize",
        updateScrollUI
    );


    /* Top Button */
    if (topButton) {
        topButton.addEventListener("click", () => {

            const project =
                document.querySelector(".project");

            const main =
                document.querySelector("main");


            /* Window scroll */
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            /* 내부 스크롤 컨테이너 대응 */
            if (project && project.scrollTop > 0) {
                project.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            if (main && main.scrollTop > 0) {
                main.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        });
    }


    /* 최초 상태 */
    updateScrollUI();
}


/* ========================================
   Back Button
======================================== */

function initBackButton() {
    const backButton =
        document.querySelector(".back-button");

    if (!backButton) return;

    backButton.addEventListener("click", () => {
        document.body.classList.add(
            "is-page-leaving"
        );

        window.setTimeout(() => {
            window.location.href =
                "../index.html";
        }, 400);
    });
}


/* ========================================
   type-01 Strategy
======================================== */

function initStrategy() {

    const strategy = document.querySelector(".project-strategy");

    if (!strategy) return;


    if (!("IntersectionObserver" in window)) {
        strategy.classList.add("is-active");
        return;
    }


    const observer = new IntersectionObserver(
        ([entry]) => {

            if (!entry.isIntersecting) return;

            strategy.classList.add("is-active");

            observer.unobserve(strategy);

        },
        {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        }
    );


    observer.observe(strategy);

}