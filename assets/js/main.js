(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("DOMContentLoaded", function () {
        setActiveNavFromPath();
        setupScrollProgress();
        setupBackToTop();

        if (!prefersReducedMotion) {
            setupRevealOnScroll();
        }
    });

    function setActiveNavFromPath() {
        const path = window.location.pathname.toLowerCase();
        const links = document.querySelectorAll(".nav-link");

        links.forEach(function (link) {
            const href = (link.getAttribute("href") || "").toLowerCase();
            if (!href) {
                return;
            }

            const cleanHref = href.replace(/^\.\.\//, "");
            const isMatch = path.endsWith(cleanHref) || (cleanHref === "index.html" && (path.endsWith("/") || path === ""));

            if (isMatch) {
                links.forEach(function (item) { item.classList.remove("active"); });
                link.classList.add("active");
            }
        });
    }

    function setupRevealOnScroll() {
        const revealItems = document.querySelectorAll("main > *, .panel, .figure");

        if (!revealItems.length) {
            return;
        }

        revealItems.forEach(function (item, index) {
            item.classList.add("reveal-item");
            item.style.transitionDelay = Math.min(index * 55, 360) + "ms";
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    }

    function setupScrollProgress() {
        const progress = document.createElement("div");
        progress.className = "scroll-progress";
        document.body.appendChild(progress);

        function updateProgress() {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
            progress.style.transform = "scaleX(" + ratio + ")";
        }

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    function setupBackToTop() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "to-top-btn";
        button.textContent = "Top";
        button.setAttribute("aria-label", "Back to top");
        document.body.appendChild(button);

        function toggleVisibility() {
            button.classList.toggle("is-visible", window.scrollY > 280);
        }

        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        toggleVisibility();
    }

})();
