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
    initType02Scroll();
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

            const selector =
                button.dataset.scrollTarget;

            const target =
                document.querySelector(selector);

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
   Common
======================================== */

function initReveal() {

    const elements =
        document.querySelectorAll(
            "[data-reveal]"
        );

    if (!elements.length) return;


    if (!("IntersectionObserver" in window)) {

        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const element =
                        entry.target;


                    const delay =
                        Number(
                            element.dataset.revealDelay || 0
                        );


                    window.setTimeout(() => {

                        element.classList.add(
                            "is-visible"
                        );

                    }, delay);


                    observer.unobserve(
                        element
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -8% 0px"
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

    const elements =
        document.querySelectorAll(
            "[data-parallax]"
        );

    if (!elements.length) return;


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (reducedMotion.matches) {
        return;
    }


    let ticking = false;


    function update() {

        const viewportHeight =
            window.innerHeight;


        elements.forEach((element) => {

            const rect =
                element.getBoundingClientRect();


            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }


            const speed =
                Number(
                    element.dataset.parallax || 0
                );


            const center =
                rect.top +
                rect.height / 2;


            const viewportCenter =
                viewportHeight / 2;


            const distance =
                center -
                viewportCenter;


            const offset =
                distance *
                speed;


            element.style.transform =
                `translate3d(0, ${offset}px, 0)`;

        });


        ticking = false;

    }


    function requestUpdate() {

        if (ticking) return;


        ticking = true;


        window.requestAnimationFrame(
            update
        );

    }


    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive: true
        }
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
        document.querySelector(
            ".sub-header"
        );


    const topButton =
        document.querySelector(
            ".top-button"
        );


    if (!subHeader && !topButton) {
        return;
    }


    function getScrollTop() {

        const project =
            document.querySelector(
                ".project"
            );


        const main =
            document.querySelector(
                "main"
            );


        return Math.max(
            window.scrollY || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0,
            project
                ? project.scrollTop
                : 0,
            main
                ? main.scrollTop
                : 0
        );

    }


    function updateScrollUI() {

        const scrollTop =
            getScrollTop();


        if (subHeader) {

            subHeader.classList.toggle(
                "is-scrolled",
                scrollTop > 40
            );

        }


        if (topButton) {

            topButton.classList.toggle(
                "is-visible",
                scrollTop > 400
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateScrollUI,
        {
            passive: true
        }
    );


    document.addEventListener(
        "scroll",
        updateScrollUI,
        {
            passive: true,
            capture: true
        }
    );


    window.addEventListener(
        "resize",
        updateScrollUI
    );


    if (topButton) {

        topButton.addEventListener(
            "click",
            () => {

                const project =
                    document.querySelector(
                        ".project"
                    );


                const main =
                    document.querySelector(
                        "main"
                    );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


                if (
                    project &&
                    project.scrollTop > 0
                ) {

                    project.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }


                if (
                    main &&
                    main.scrollTop > 0
                ) {

                    main.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    updateScrollUI();

}


/* ========================================
   Back Button
======================================== */

function initBackButton() {

    const backButton =
        document.querySelector(
            ".back-button"
        );


    if (!backButton) return;


    backButton.addEventListener(
        "click",
        () => {

            document.body.classList.add(
                "is-page-leaving"
            );


            window.setTimeout(
                () => {

                    window.location.href =
                        "../index.html";

                },
                400
            );

        }
    );

}


/* ========================================
   Type 01 Strategy
======================================== */

function initStrategy() {

    const strategy =
        document.querySelector(
            ".project-strategy"
        );


    if (!strategy) return;


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        strategy.classList.add(
            "is-active"
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            ([entry]) => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }


                strategy.classList.add(
                    "is-active"
                );


                observer.unobserve(
                    strategy
                );

            },
            {
                threshold: 0.25,
                rootMargin:
                    "0px 0px -10% 0px"
            }
        );


    observer.observe(
        strategy
    );

}


/* ========================================
   Type 02 Scroll Interaction
======================================== */

function initType02Scroll() {

    const project =
        document.querySelector(
            ".project--type-02"
        );


    if (!project) return;


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    /*
     * Reduced Motion
     */

    if (reducedMotion.matches) {

        project.classList.add(
            "is-type02-reduced"
        );


        project
            .querySelectorAll(
                ".type02-motion"
            )
            .forEach((element) => {

                element.classList.add(
                    "is-type02-visible"
                );

            });


        return;
    }


    /*
     * Motion Targets
     */

    const targets = [];


    function register(
        selector,
        options = {}
    ) {

        const elements =
            project.querySelectorAll(
                selector
            );


        elements.forEach(
            (element, index) => {

                element.classList.add(
                    "type02-motion"
                );


                if (
                    options.type
                ) {

                    element.classList.add(
                        `type02-motion--${options.type}`
                    );

                }


                if (
                    options.stagger
                ) {

                    element.style.setProperty(
                        "--type02-delay",
                        `${
                            index *
                            options.stagger
                        }ms`
                    );

                }


                targets.push({
                    element,
                    threshold:
                        options.threshold ?? 0.15,
                    rootMargin:
                        options.rootMargin ??
                        "0px 0px -10% 0px"
                });

            }
        );

    }


    /*
     * Intro / Framework
     */

    register(
        ".project-framework__header",
        {
            type: "up"
        }
    );


    register(
        ".project-framework__diagram",
        {
            type: "framework",
            threshold: 0.2
        }
    );


    /*
     * Challenge
     */

    register(
        ".project-challenge__header",
        {
            type: "up"
        }
    );


    register(
        ".project-challenge__summary",
        {
            type: "challenge",
            threshold: 0.18
        }
    );


    /*
     * Strategy
     */

    register(
        ".project-direction__intro",
        {
            type: "up"
        }
    );


    register(
        ".project-direction__labels",
        {
            type: "fade"
        }
    );


    register(
        ".project-direction__row",
        {
            type: "strategy",
            stagger: 90,
            threshold: 0.12
        }
    );


    /*
     * Process
     */

    register(
        ".project-process__header",
        {
            type: "up"
        }
    );


    register(
        ".project-process__item",
        {
            type: "process",
            stagger: 100,
            threshold: 0.12
        }
    );


    /*
     * UX Strategy
     */

    register(
        ".project-ux-strategy__header",
        {
            type: "up"
        }
    );


    register(
        ".project-ux-strategy__item",
        {
            type: "card",
            stagger: 110,
            threshold: 0.12
        }
    );


    /*
     * Experience
     */

    register(
        ".project-experience__header",
        {
            type: "up"
        }
    );


    register(
        ".project-experience__visual",
        {
            type: "visual",
            threshold: 0.12
        }
    );


    register(
        ".project-experience__responsive",
        {
            type: "visual",
            threshold: 0.12
        }
    );


    /*
     * Asset
     */

    register(
        ".project-asset__header",
        {
            type: "up"
        }
    );


    register(
        ".project-asset__item",
        {
            type: "card",
            stagger: 100,
            threshold: 0.1
        }
    );


    /*
     * Closing
     */

    register(
        ".project-closing__content",
        {
            type: "up",
            threshold: 0.2
        }
    );


    /*
     * Observer
     */

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        targets.forEach(
            ({ element }) => {

                element.classList.add(
                    "is-type02-visible"
                );

            }
        );

        return;
    }


    targets.forEach(
        ({
            element,
            threshold,
            rootMargin
        }) => {

            const observer =
                new IntersectionObserver(
                    ([entry]) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        element.classList.add(
                            "is-type02-visible"
                        );


                        observer.unobserve(
                            element
                        );

                    },
                    {
                        threshold,
                        rootMargin
                    }
                );


            observer.observe(
                element
            );

        }
    );

    /* ========================================
         Type 02 Scroll
    ======================================== */

    function initType02Scroll() {

        const project =
            document.querySelector(
                ".project--type-02"
            );

        if (!project) return;


        const challenge =
            project.querySelector(
                ".project-challenge__summary"
            );

        if (!challenge) return;


        challenge.classList.add(
            "type02-motion",
            "type02-motion--challenge"
        );


        if (
            !(
                "IntersectionObserver"
                in window
            )
        ) {

            challenge.classList.add(
                "is-type02-visible"
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                ([entry]) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "is-type02-visible"
                    );


                    observer.unobserve(
                        entry.target
                    );

                },
                {
                    threshold: 0.15,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        observer.observe(
            challenge
        );

    }

}