$(document).ready(function () {

    const $menu = $('#menu');
    const $navbar = $('.navbar');
    const $scrollTop = $('#scroll-top');
    const $navLinks = $('.navbar ul li a');
    const $sections = $('section');

    $menu.on('click', function () {
        $(this).toggleClass('fa-times');
        $navbar.toggleClass('nav-toggle');
    });

    // Cache section geometries to avoid synchronous layout thrashing during scroll
    let sectionPositions = [];
    function calculateSectionPositions() {
        sectionPositions = [];
        $sections.each(function () {
            const $sec = $(this);
            const id = $sec.attr('id');
            if (id) {
                const top = $sec.offset().top;
                const height = $sec.outerHeight();
                sectionPositions.push({ id, top, height });
            }
        });
    }

    calculateSectionPositions();
    $(window).on('resize', calculateSectionPositions);

    // High performance scroll handler with requestAnimationFrame
    let isScrolling = false;
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Toggle back to top button
        if (scrollY > 100) {
            $scrollTop.addClass('active');
        } else {
            $scrollTop.removeClass('active');
        }

        // Close mobile menu if open during scroll
        if ($navbar.hasClass('nav-toggle')) {
            $menu.removeClass('fa-times');
            $navbar.removeClass('nav-toggle');
        }

        // Fast scroll spy using precomputed positions
        const checkPoint = scrollY + 220;
        let currentId = '';
        for (let i = 0; i < sectionPositions.length; i++) {
            const sec = sectionPositions[i];
            if (checkPoint >= sec.top && checkPoint < sec.top + sec.height) {
                currentId = sec.id;
                break;
            }
        }

        if (currentId) {
            $navLinks.removeClass('active');
            $navbar.find(`[href="#${currentId}"]`).addClass('active');
        }

        isScrolling = false;
    }

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(handleScroll);
        }
    }, { passive: true });

    // Initial check on load
    handleScroll();

    // Smooth anchor navigation using native smooth scroll
    $('a[href^="#"]').on('click', function (e) {
        const targetId = $(this).attr('href');
        if (!targetId || targetId === '#' || targetId.length < 2) return;
        const $target = $(targetId);
        if (!$target.length) return;

        e.preventDefault();
        $menu.removeClass('fa-times');
        $navbar.removeClass('nav-toggle');

        const offsetTop = $target.offset().top - 60;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });

    // EmailJS to mail contact form data
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });

});

// Maintain Darshan Hegde title on visibility change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Darshan Hegde";
        $("#favicon").attr("href", "assets/images/favicon.jpg");
    } else {
        document.title = "Come Back | Darshan Hegde";
        $("#favicon").attr("href", "assets/images/favicon.jpg");
    }
});

// Typed.js effect
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "android development", "Full Stack Web Development"],
    loop: true,
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 500,
});

async function fetchData(type = "skills") {
    let response;
    try {
        type === "skills" ?
            response = await fetch("skills.json")
            :
            response = await fetch("./projects/projects.json");
        const data = await response.json();
        return data;
    } catch (e) {
        return null;
    }
}

function showSkills(skills) {
    if (!skills || !skills.length) return;
    let skillsContainer = document.getElementById("skillsContainer");
    if (!skillsContainer) return;
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`;
    });
    skillsContainer.innerHTML = skillHTML;
}

fetchData().then(data => {
    if (data) showSkills(data);
}).catch(() => {
    // skills.json optional; static skills in index.html are used
});

// Tilt js effect for hero/about
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".home .tilt, .about .tilt"), {
        max: 12,
        speed: 400,
        glare: false
    });
}

// Disable developer keyboard shortcuts
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
};

/* ===== SCROLL REVEAL ANIMATION (Smooth & Non-jittery) ===== */
if (typeof ScrollReveal !== 'undefined') {
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '50px',
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        reset: false
    });

    /* SCROLL HOME */
    srtop.reveal('.home .content h3', { delay: 150 });
    srtop.reveal('.home .content p', { delay: 150 });
    srtop.reveal('.home .content .btn', { delay: 150 });
    srtop.reveal('.home .image', { delay: 250 });
    srtop.reveal('.home .social-icons li', { interval: 150 });

    /* SCROLL ABOUT */
    srtop.reveal('.about .content h3', { delay: 150 });
    srtop.reveal('.about .content .tag', { delay: 150 });
    srtop.reveal('.about .content p', { delay: 150 });
    srtop.reveal('.about .content .box-container', { delay: 150 });
    srtop.reveal('.about .content .resumebtn', { delay: 150 });

    /* SCROLL SKILLS */
    srtop.reveal('.skills .container', { interval: 150 });
    srtop.reveal('.skills .container .bar', { delay: 200, interval: 50 });

    /* SCROLL EDUCATION */
    srtop.reveal('.education .box', { interval: 150 });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .heading', { delay: 150 });
    srtop.reveal('.projects-scroll-wrapper', { delay: 200 });

    /* SCROLL CERTIFICATES */
    srtop.reveal('.certificates .box', { interval: 150 });

    /* SCROLL EXPERIENCE */
    srtop.reveal('.experience .timeline', { delay: 200 });
    srtop.reveal('.experience .timeline .container', { interval: 200 });

    /* SCROLL CONTACT */
    srtop.reveal('.contact .container', { delay: 200 });
}
