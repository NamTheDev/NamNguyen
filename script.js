// script.js

// ==================================================
// Fetch and Populate Content from config.json
// ==================================================

// Fetch data from config.json and populate the content
fetch('config.json')
    .then(response => response.json())
    .then(async data => {
        data.personalInfo.biography = (await (await fetch(data.personalInfo.biography)).text()).split('\n').join('<br>');
        populateContent(data);
    })
    .catch(error => console.error('Error loading config.json:', error));

// Close modal on clicking the close button
function closeModal() {
    document.body.classList.remove('no-interaction');
    document.body.removeChild(document.querySelector('.artwork-modal'));
}

/**
 * Populates all the main content sections of the page using the data from config.json
 * @param {Object} data - The data object retrieved from config.json
 */
function populateContent(data) {
    populatePersonalInfo(data.personalInfo);
    populateWorks(data.projects);
    populateSocialMedia(data.socialMedia);
    populateFooter(data.contactInfo, data.siteInfo);
}

// ==================================================
// Set Page Title using FIGlet (ASCII Art)
// ==================================================

// Note: FIGlet is a library that generates ASCII art from text. It needs to be included in your HTML file.
// Ensure you have included figlet.js in your HTML for this to work.

// Set the title of the page using FIGlet with the 'Graffiti' font
figlet('Hello World!', 'Graffiti', function (err, text) {
    if (err) {
        console.log('Something went wrong with FIGlet...');
        console.dir(err);
        return;
    }
    // Create a <pre> element to preserve formatting
    const pre = document.createElement('pre');
    pre.textContent = text;
    // Append the ASCII art to the element with id 'portfolio-title'
    document.getElementById('portfolio-title').appendChild(pre);
});

// ==================================================
// Populate Personal Information
// ==================================================

/**
 * Populates the personal information section with name and biography
 * @param {Object} info - The personalInfo object from config.json
 */
function populatePersonalInfo(info) {
    // Set the name in the element with id 'info-name'
    document.getElementById('info-name').textContent = info.name;
    // Set the biography in the element with id 'biography'
    document.getElementById('biography').innerHTML = info.biography;
}

// ==================================================
// Populate Works Section
// ==================================================

/**
 * Populates the Works section with projects from various categories
 * @param {Object} projects - The projects object from config.json
 */
function populateWorks(projects) {
    const worksContent = document.getElementById('works-content');

    // Iterate over each category in projects
    for (let category in projects) {
        if (projects[category].length > 0) {
            // Create a section for the category
            const section = document.createElement('div');
            section.classList.add('work-section');

            // Add a heading for the category
            const heading = document.createElement('h3');
            heading.textContent = formatCategoryName(category);
            section.appendChild(heading);

            // Create a grid to display the works
            const grid = document.createElement('div');
            grid.classList.add('work-grid');

            // Iterate over each item in the category
            projects[category].forEach(item => {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');

                // Add the title of the work
                const title = document.createElement('h4');
                title.textContent = item.title || item.name || item.platform;
                workItem.appendChild(title);

                // If the category is 'art' and there's an image, add the image
                if (category === 'art' && item.image) {
                    const img = document.createElement('img');
                    img.src = item.image;
                    img.alt = item.title;
                    img.classList.add('artwork-image');
                    // Also add functionality to toggle pop out image on click
                    img.addEventListener('click', () => {
                        document.body.insertAdjacentHTML('beforeend', `<div class="artwork-modal">
                        <img src="${item.image}" alt="${item.title}" class="artwork-modal-image">
                        <button class="artwork-modal-close" onclick="closeModal()">&times;</button>
                    </div>`);
                        document.body.classList.toggle('no-interaction');
                    });
                    workItem.appendChild(img);
                }

                // Add the description of the work
                const desc = document.createElement('p');
                desc.textContent = item.description;
                workItem.appendChild(desc);

                // Add a link to the work if available
                if (item.link && item.link !== '#') {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = '_blank';
                    link.textContent = 'Learn More';
                    workItem.appendChild(link);
                } else if (item.videoCode) {
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${item.videoCode}`;
                    iframe.title = item.title;
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    iframe.style.marginTop = 'auto';
                    workItem.appendChild(iframe);
                }

                // Add the work item to the grid
                grid.appendChild(workItem);
            });

            // Add the grid to the section
            section.appendChild(grid);
            // Add the section to the works content area
            worksContent.appendChild(section);
        }
    }
}

/**
 * Formats the category names for display
 * @param {String} category - The category key from projects object
 * @returns {String} - The formatted category name
 */
function formatCategoryName(category) {
    switch (category) {
        case 'development':
            return 'Development Projects';
        case 'art':
            return 'Artworks';
        case 'music':
            return 'Music';
        case 'contentCreation':
            return 'Content Creation';
        // Add more cases if you have other categories
        default:
            return '';
    }
}

// ==================================================
// Populate Social Media Links
// ==================================================

/**
 * Populates the social media section with links to social profiles
 * @param {Object} socials - The socialMedia object from config.json
 */
function populateSocialMedia(socials) {
    const socialLinks = document.getElementById('social-links');

    // Iterate over each social link and create a link element
    socials.forEach(({ icon, title, link }) => {
        const socialLink = createSocialLink(icon, title, link);
        socialLinks.appendChild(socialLink);
    });
}

/**
 * Creates a social media link element
 * @param {String} iconClass - The Font Awesome icon class
 * @param {String} text - The text to display
 * @param {String} href - The URL of the social profile
 * @returns {HTMLElement} - The anchor element with the social link
 */
function createSocialLink(iconClass, text, href) {
    const link = document.createElement('a');
    link.onclick = (event) => {
        const confirmation = confirm('You sure you want to go to ' + href + '?');   
        if (!confirmation) event.preventDefault();
    };
    link.href = href;
    link.target = '_blank';
    link.innerHTML = `<i class="${iconClass}"></i>${text}`;
    return link;
}

// ==================================================
// Populate Footer Information
// ==================================================

/**
 * Populates the footer with contact information and site info
 * @param {Object} contactInfo - The contactInfo object from config.json
 * @param {Object} siteInfo - The siteInfo object from config.json
 */
function populateFooter(contactInfo, siteInfo) {
    // Set the email link
    const emailLink = document.getElementById('email-link');
    emailLink.href = 'mailto:' + contactInfo.email;
    emailLink.textContent = contactInfo.email;

    // Set the footer text (e.g., copyright)
    const footerText = document.getElementById('footer-text');
    footerText.textContent = siteInfo.copyright;
}

// ==================================================
// Animate Sections on Scroll
// ==================================================

// Get all sections except the cover section
const sections = Array.from(document.querySelectorAll('section')).filter(section => section.id !== 'cover');

// Options for the Intersection Observer
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the section is visible
};

/**
 * Callback function for the Intersection Observer
 * Adds the 'visible' class to sections when they come into view
 * @param {Array} entries - The intersection observer entries
 * @param {IntersectionObserver} observer - The observer instance
 */
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add the 'visible' class to trigger CSS animations
            entry.target.classList.add('visible');
            // Stop observing the current target
            observer.unobserve(entry.target);
        }
    });
};

// Create the Intersection Observer
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Add the 'invisible' class to all sections and start observing them
sections.forEach(section => {
    section.classList.add('invisible');
    observer.observe(section);
});

// ==================================================
// Smooth Scrolling Functionality
// ==================================================

document.addEventListener('DOMContentLoaded', function () {
    // Delay adding 'visible' class to the cover content for a fade-in effect
    setTimeout(() => {
        document.querySelector('.cover-content').classList.add('visible');
    }, 1000);

    // Get all navigation links that start with '#'
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    const navHeight = document.getElementById('main-nav').offsetHeight; // Height of the navigation bar

    // Add click event listeners to navigation links for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default anchor behavior

            const targetId = this.getAttribute('href').substring(1); // Get the target section ID
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate the scroll position, accounting for the nav bar height
                const targetPosition = targetSection.offsetTop - navHeight;
                // Smoothly scroll to the target position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });
});

// ==================================================
// Highlight Active Navigation Link on Scroll
// ==================================================

// Get all navigation links
const navLinks = document.querySelectorAll('#main-nav ul li a');

// Add scroll event listener to window
window.addEventListener('scroll', () => {
    const navHeight = document.getElementById('main-nav').offsetHeight;
    let currentSectionId = '';

    // Determine the current section in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 200;
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Update the active class on navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSectionId) {
            link.classList.add('active');
        }
    });
});

// ==================================================
// Theme Toggle Functionality (Light/Dark Mode)
// ==================================================

// Get elements related to theme toggling
const toggleThemeButton = document.getElementById('theme-toggle');
const lightModeElement = document.getElementById('light-mode'); // Element representing light mode styles
const toggleThemeIcon = document.querySelector('#theme-toggle i'); // Icon inside the theme toggle button

let isLightMode = false; // State variable to track the current theme

// Add click event listener to the theme toggle button
toggleThemeButton.addEventListener('click', function () {
    isLightMode = !isLightMode; // Toggle the theme state

    // Show or hide the light mode element based on the current theme state
    lightModeElement.style.display = isLightMode ? 'block' : 'none';
    lightModeElement.style.opacity = isLightMode ? '1' : '0';

    // Invert the images and iframes again  to return to their original state
    document.querySelectorAll('img, iframe').forEach(element => {
        element.style.filter = isLightMode ? 'invert(1)' : 'invert(0)';
    });

    // Update the icon to reflect the current theme
    toggleThemeIcon.classList.toggle('fa-sun', isLightMode);
    toggleThemeIcon.classList.toggle('fa-moon', !isLightMode);
});

// ==================================================
// Navigation Menu Toggle for Mobile Devices
// ==================================================

// Get elements related to navigation menu toggling
const toggleNavButton = document.getElementById('nav-toggle');
const toggleNavIcon = document.querySelector('#nav-toggle i');
const navDropdown = document.getElementById('nav-dropdown'); // The dropdown menu element

let isNavOpen = false; // State variable to track if the navigation menu is open

// Add click event listener to the navigation toggle button
toggleNavButton.addEventListener('click', function () {
    isNavOpen = !isNavOpen; // Toggle the navigation menu state

    // Show or hide the navigation dropdown based on the current state
    navDropdown.classList.toggle('show', isNavOpen);

    // Update the icon to reflect the current state
    toggleNavIcon.classList.toggle('fa-angle-down', isNavOpen);
    toggleNavIcon.classList.toggle('fa-bars', !isNavOpen);
});

// ==================================================
// End of script.js
// ==================================================