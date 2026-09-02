/* script.js */


/* =========================
   MOBILE MENU
========================== */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* =========================
   CLOSE MENU AFTER CLICK
========================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   BACK TO TOP
========================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.classList.add("active");

    } else {

        backToTop.classList.remove("active");

    }

});


/* =========================
   FOOTER YEAR
========================== */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================
   CONTACT FORM
========================== */

const contactForm =
    document.getElementById("contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    alert(
        "Thank you, " +
        name +
        "! Your message has been received."
    );

    contactForm.reset();

});


/* =========================
   GITHUB HEATMAP
========================== */

async function loadGitHubHeatmap() {

    const username = "mbpragathi";

    const heatmap =
        document.getElementById("heatmap");

    const contributionCount =
        document.getElementById("contribution-count");

    const monthLabels =
        document.getElementById("month-labels");


    try {

        const response = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=lastYear`
        );

        if (!response.ok) {
            throw new Error("GitHub contribution API failed");
        }

        const data = await response.json();

        const contributionMap = new Map();

        data.contributions.forEach(day => {

            contributionMap.set(
                day.date,
                day
            );

        });


        /* =========================
           DATE HELPERS
        ========================== */

        function dateKey(date) {

            return date.toISOString().split("T")[0];

        }


        function formatDate(date) {

            return date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

        }


        /* =========================
           GET LAST 365 DAYS
        ========================== */

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);

        startDate.setDate(
            startDate.getDate() - 364
        );


        /*
         * Move start date backward to Sunday
         * so every week has exactly 7 rows.
         */

        startDate.setDate(
            startDate.getDate() - startDate.getDay()
        );


        /* =========================
           CREATE WEEKS
        ========================== */

        heatmap.innerHTML = "";

        monthLabels.innerHTML = "";

        let currentDate =
            new Date(startDate);

        let weekIndex = 0;

        const monthPositions = new Map();


        while (currentDate <= today || currentDate.getDay() !== 0) {

            const week =
                document.createElement("div");

            week.className = "week";


            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {

                const date =
                    new Date(currentDate);

                const key =
                    dateKey(date);

                const contribution =
                    contributionMap.get(key);


                const square =
                    document.createElement("div");

                square.className = "day";


                if (
                    date < startDate ||
                    date > today
                ) {

                    square.classList.add("level-0");

                    square.style.visibility =
                        "hidden";

                } else {

                    const level =
                        contribution
                            ? contribution.level
                            : 0;

                    const count =
                        contribution
                            ? contribution.count
                            : 0;

                    square.classList.add(
                        `level-${level}`
                    );

                    square.setAttribute(
                        "data-tooltip",
                        `${count} contribution${count === 1 ? "" : "s"} on ${formatDate(date)}`
                    );

                }


                week.appendChild(square);

                currentDate.setDate(
                    currentDate.getDate() + 1
                );

            }


            heatmap.appendChild(week);

            weekIndex++;

        }


        /* =========================
           MONTH LABELS
        ========================== */

        const weeks =
            heatmap.querySelectorAll(".week");

        weeks.forEach((week, index) => {

            const firstSquare =
                week.querySelector(".day");

            if (!firstSquare) {
                return;
            }

            const date =
                new Date(startDate);

            date.setDate(
                date.getDate() + index * 7
            );


            const monthKey =
                `${date.getFullYear()}-${date.getMonth()}`;


            /*
             * Add label when a new month begins.
             */

            if (
                date.getDate() <= 7 &&
                !monthPositions.has(monthKey)
            ) {

                monthPositions.set(
                    monthKey,
                    index
                );

                const label =
                    document.createElement("span");

                label.className =
                    "month-label";

                label.textContent =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            month: "short"
                        }
                    );

                label.style.left =
                    `${index * 16}px`;

                monthLabels.appendChild(label);

            }

        });


        /* =========================
           CONTRIBUTION TOTAL
        ========================== */

        let total = 0;

        data.contributions.forEach(day => {

            total += Number(day.count) || 0;

        });


        contributionCount.textContent =
            `${total} contribution${total === 1 ? "" : "s"} in the last year`;


    } catch (error) {

        console.error(
            "Unable to load GitHub contributions:",
            error
        );

        contributionCount.textContent =
            "Unable to load GitHub contributions";

        heatmap.innerHTML = "";

    }

}


/* =========================
   LOAD HEATMAP
========================== */

loadGitHubHeatmap();


/* =========================
   ACTIVE NAVIGATION
========================== */

const sections =
    document.querySelectorAll("section");

const navItems =
    document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 100;

        const sectionHeight =
            section.clientHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.style.color = "";

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.style.color =
                "#38bdf8";

        }

    });

});