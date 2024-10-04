// Improved script.js

(function () {
    'use strict';

    // Cache DOM elements
    // Cache DOM elements for later use
    const elements = {
        portfolioTitle: document.getElementById('portfolio-title'),
        infoName: document.getElementById('info-name'),
        biography: document.getElementById('biography'),
        worksContent: document.getElementById('works-content'),
        socialLinks: document.getElementById('social-links'),
        emailLink: document.getElementById('email-link'),
        footerText: document.getElementById('footer-text'),
        coverContent: document.querySelector('.cover-content'),
        mainNav: document.getElementById('main-nav'),
        navLinks: document.querySelectorAll('#main-nav a[href^="#"]'),
        sections: Array.from(document.querySelectorAll('section')).filter(section => section.id !== 'cover'),
        toggleThemeButton: document.getElementById('theme-toggle'),
        lightModeElement: document.getElementById('light-mode'),
        toggleThemeIcon: document.querySelector('#theme-toggle i'),
        toggleNavButton: document.getElementById('nav-toggle'),
        toggleNavIcon: document.querySelector('#nav-toggle i'),
        navDropdown: document.getElementById('nav-dropdown')
    };

    // Initialize theme and navigation state
    let isLightMode = localStorage.getItem('theme') === 'light';
    let isNavOpen = false;

    // Fetch and populate content
    // Fetch and populate content from config.json
    async function init() {
        try {
            const response = await fetch('config.json');
            const data = await response.json();
            data.personalInfo.biography = await fetchBiography(data.personalInfo.biography);
            populateContent(data);
            setupEventListeners();
            setInitialTheme();
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    // Fetch biography text and format it
    async function fetchBiography(url) {
        const response = await fetch(url);
        const text = await response.text();
        return text.split('\n').join('<br>');
    }

    // Populate various sections of the page with data
    function populateContent(data) {
        populatePersonalInfo(data.personalInfo);
        populateWorks(data.projects);
        populateSocialMedia(data.socialMedia);
        populateFooter(data.contactInfo, data.siteInfo);
        setPageTitle();
    }

    // Set the page title using FIGlet for ASCII art
    function setPageTitle() {
        if (typeof figlet === 'function') {
            figlet('Hello World!', 'Graffiti', function (err, text) {
                if (err) {
                    console.error('Error with FIGlet:', err);
                    return;
                }
                const pre = document.createElement('pre');
                pre.textContent = text;
                elements.portfolioTitle.appendChild(pre);
                elements.portfolioTitle.parentElement.classList.add('visible');
            });
        }
    }

    // Populate personal information section
    function populatePersonalInfo(info) {
        if (elements.infoName) elements.infoName.textContent = info.name;
        if (elements.biography) elements.biography.innerHTML = info.biography;
    }

    // Populate works/projects section
    function populateWorks(projects) {
        if (!elements.worksContent) return;

        for (let category in projects) {
            if (projects[category].length > 0) {
                const section = createWorkSection(category, projects[category]);
                elements.worksContent.appendChild(section);
            }
        }
    }

    // Create a section for each category of works
    function createWorkSection(category, items) {
        const section = document.createElement('div');
        section.classList.add('work-section');

        const heading = document.createElement('h3');
        heading.textContent = formatCategoryName(category);
        section.appendChild(heading);

        const grid = document.createElement('div');
        grid.classList.add('work-grid');

        items.forEach(item => {
            const workItem = createWorkItem(category, item);
            grid.appendChild(workItem);
        });

        section.appendChild(grid);
        return section;
    }

    // Create individual work item elements
    function createWorkItem(category, item) {
        const workItem = document.createElement('div');
        workItem.classList.add('work-item');

        const title = document.createElement('h4');
        title.textContent = item.title || item.name || item.platform;
        workItem.appendChild(title);

        if (category === 'art' && item.image) {
            const img = createArtworkImage(item);
            workItem.appendChild(img);
        }

        const desc = document.createElement('p');
        desc.textContent = item.description;
        workItem.appendChild(desc);

        if (item.link && item.link !== '#') {
            const link = createExternalLink(item.link, 'Learn More');
            workItem.appendChild(link);
        } else if (item.videoCode) {
            const iframe = createYouTubeEmbed(item);
            workItem.appendChild(iframe);
        }

        return workItem;
    }

    function createArtworkImage(item) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.classList.add('artwork-image');
        img.addEventListener('click', () => openArtworkModal(item));
        return img;
    }

    function createExternalLink(href, text) {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = text;
        return link;
    }

    function createYouTubeEmbed(item) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${item.videoCode}`;
        iframe.title = item.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        return iframe;
    }

    function openArtworkModal(item) {
        const modal = document.createElement('div');
        modal.classList.add('artwork-modal');
        modal.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="artwork-modal-image">
            <button class="artwork-modal-close">&times;</button>
        `;
        document.body.appendChild(modal);
        document.body.classList.add('no-interaction');

        const closeButton = modal.querySelector('.artwork-modal-close');
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add keyboard accessibility
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        closeButton.focus();
    }

    function closeModal() {
        const modal = document.querySelector('.artwork-modal');
        if (modal) {
            document.body.removeChild(modal);
            document.body.classList.remove('no-interaction');
        }
    }

    function formatCategoryName(category) {
        const categoryMap = {
            development: 'Development Projects',
            art: 'Artworks',
            music: 'Music',
            contentCreation: 'Content Creation'
        };
        return categoryMap[category] || '';
    }

    function populateSocialMedia(socials) {
        if (!elements.socialLinks) return;

        socials.forEach(({ icon, title, link }) => {
            const socialLink = createSocialLink(icon, title, link);
            elements.socialLinks.appendChild(socialLink);
        });
    }

    function createSocialLink(iconClass, text, href) {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="${iconClass}"></i>${text}`;
        return link;
    }

    function populateFooter(contactInfo, siteInfo) {
        if (elements.emailLink) {
            elements.emailLink.href = 'mailto:' + contactInfo.email;
            elements.emailLink.textContent = contactInfo.email;
        }
        if (elements.footerText) {
            elements.footerText.textContent = siteInfo.copyright;
        }
    }

    function setupEventListeners() {
        // Scroll animation
        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
        elements.sections.forEach(section => {
            section.classList.add('invisible');
            observer.observe(section);
        });

        // Smooth scrolling
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Active navigation link highlighting
        window.addEventListener('scroll', highlightActiveNavLink);

        // Theme toggle
        elements.toggleThemeButton.addEventListener('click', toggleTheme);

        // Navigation menu toggle
        elements.toggleNavButton.addEventListener('click', toggleNavMenu);
    }

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }

    function handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - elements.mainNav.offsetHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    function highlightActiveNavLink() {
        const navHeight = elements.mainNav.offsetHeight;
        let currentSectionId = '';

        elements.sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 200;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentSectionId);
        });
    }

    function setInitialTheme() {
        document.body.classList.toggle('light-mode', isLightMode);
        updateThemeStyles();
    }

    function toggleTheme() {
        isLightMode = !isLightMode;
        document.body.classList.toggle('light-mode', isLightMode);
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        updateThemeStyles();
    }

    function updateThemeStyles() {
        elements.lightModeElement.style.display = isLightMode ? 'block' : 'none';
        elements.lightModeElement.style.opacity = isLightMode ? '1' : '0';
        document.querySelectorAll('img, iframe').forEach(element => {
            element.style.filter = isLightMode ? 'invert(1)' : 'invert(0)';
        });
        elements.toggleThemeIcon.classList.toggle('fa-sun', isLightMode);
        elements.toggleThemeIcon.classList.toggle('fa-moon', !isLightMode);
    }

    function toggleNavMenu() {
        isNavOpen = !isNavOpen;
        elements.navDropdown.classList.toggle('show', isNavOpen);
        elements.toggleNavIcon.classList.toggle('fa-angle-down', isNavOpen);
        elements.toggleNavIcon.classList.toggle('fa-bars', !isNavOpen);
    }

    // Initialize the script
    document.addEventListener('DOMContentLoaded', init);
})();