document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const settingsModal = document.getElementById('settingsModal');
    const settingsLink = document.querySelector('a[href="#settings"]');
    const closeSettings = document.querySelector('.close-settings');
    const darkModeToggle = document.getElementById('darkMode');
    const fontSizeSelect = document.getElementById('fontSize');
    const homeLink = document.querySelector('a[href="#home"]');
    
    // Logo animation
    logo.addEventListener('click', () => {
        logo.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            logo.style.transform = '';
        }, 1000);
    });

    // Settings modal
    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        settingsModal.style.display = 'flex';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    // Font size selection
    fontSizeSelect.addEventListener('change', () => {
        document.body.classList.remove('font-small', 'font-large');
        if (fontSizeSelect.value !== 'medium') {
            document.body.classList.add(`font-${fontSizeSelect.value}`);
        }
        localStorage.setItem('fontSize', fontSizeSelect.value);
    });

    // Home navigation
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('.welcome-message').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.welcome-message').style.animation = 'fadeIn 1s ease-in';
        }, 10);
    });

    // About modal functionality
    const aboutModal = document.getElementById('aboutModal');
    const aboutLink = document.querySelector('a[href="#about"]');
    const closeAbout = document.querySelector('.close-about');

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.style.display = 'flex';
    });

    closeAbout.addEventListener('click', () => {
        aboutModal.style.display = 'none';
    });

    // Close modal when clicking outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });

    // Add new variables for websites modal
    const websitesModal = document.getElementById('websitesModal');
    const websitesLink = document.querySelector('a[href="#websites"]');
    const closeWebsites = document.querySelector('.close-websites');
    const repoList = document.getElementById('repoList');

    // GitHub repositories functionality
    websitesLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Hide welcome message
        document.querySelector('.welcome-message').style.display = 'none';
        
        websitesModal.style.display = 'flex';
        
        try {
            const response = await fetch('https://api.github.com/users/itsRealM12C/repos');
            const repos = await response.json();
            
            repoList.innerHTML = repos.map(repo => `
                <div class="repo-item">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <p>Language: ${repo.language || 'Not specified'}</p>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                </div>
            `).join('');
        } catch (error) {
            repoList.innerHTML = '<div class="error">Error loading repositories. Please try again later.</div>';
        }
    });

    closeWebsites.addEventListener('click', () => {
        websitesModal.style.display = 'none';
        
        // Restore welcome message
        document.querySelector('.welcome-message').style.display = 'block';
    });

    websitesModal.addEventListener('click', (e) => {
        if (e.target === websitesModal) {
            websitesModal.style.display = 'none';
            
            // Restore welcome message
            document.querySelector('.welcome-message').style.display = 'block';
        }
    });

    // GitHub repositories functionality (enhanced)
    async function fetchGitHubRepos() {
        try {
            const response = await fetch('https://api.github.com/users/itsRealM12C/repos?sort=updated');
            const repos = await response.json();
            
            return repos.slice(0, 6).map(repo => `
                <div class="repo-card">
                    <div class="repo-header">
                        <h3>${repo.name}</h3>
                        <span class="repo-language">${repo.language || 'Not specified'}</span>
                    </div>
                    <p class="repo-description">${repo.description || 'No description available'}</p>
                    <div class="repo-footer">
                        <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                        <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            return '<div class="error">Error loading repositories. Please try again later.</div>';
        }
    }

    // Modify existing scroll event handler
    let reposLoaded = false;
    window.addEventListener('scroll', async () => {
        if (reposLoaded) return;

        const welcomeMessage = document.querySelector('.welcome-message');
        const welcomeMessageBottom = welcomeMessage.getBoundingClientRect().bottom;

        if (welcomeMessageBottom <= window.innerHeight) {
            reposLoaded = true;
            
            const repoContent = await fetchGitHubRepos();
            
            // Create a new container for scroll-loaded repos
            const scrollRepoContainer = document.createElement('div');
            scrollRepoContainer.classList.add('github-repos-container');
            scrollRepoContainer.innerHTML = `
                <h2>My GitHub Repositories</h2>
                <div class="repos-grid">
                    ${repoContent}
                </div>
            `;

            // Insert the repos after the welcome message
            welcomeMessage.insertAdjacentElement('afterend', scrollRepoContainer);
        }
    });

    // Add new function to load repositories for main page
    async function loadMainPageRepos() {
        const mainRepoGrid = document.getElementById('mainRepoGrid');
        try {
            const response = await fetch('https://api.github.com/users/itsRealM12C/repos?sort=updated');
            const repos = await response.json();
            
            mainRepoGrid.innerHTML = repos.slice(0, 6).map(repo => `
                <div class="repo-card">
                    <div class="repo-header">
                        <h3>${repo.name}</h3>
                        <span class="repo-language">${repo.language || 'Not specified'}</span>
                    </div>
                    <p class="repo-description">${repo.description || 'No description available'}</p>
                    <div class="repo-footer">
                        <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                        <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            mainRepoGrid.innerHTML = '<div class="error">Error loading repositories. Please try again later.</div>';
        }
    }

    // Load the main page repositories immediately
    loadMainPageRepos();

    // Color mode selection with system preference support
    const colorModeSelect = document.getElementById('colorMode');
    
    // Check if system is using dark mode
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function handleColorModeChange() {
        // Remove previous color mode classes
        document.body.classList.remove('color-rainbow', 'color-rgbled');
        
        if (colorModeSelect.value === 'system') {
            // If system mode is selected, sync with device preference
            darkModeToggle.checked = prefersDarkScheme.matches;
            document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
            darkModeToggle.disabled = true; // Disable manual dark mode toggle when in system mode
        } else {
            // Add new color mode class if not default or system
            if (colorModeSelect.value !== 'default') {
                document.body.classList.add(`color-${colorModeSelect.value}`);
            }
            darkModeToggle.disabled = false; // Re-enable manual dark mode toggle
        }
        
        // Save color mode preference
        localStorage.setItem('colorMode', colorModeSelect.value);
    }

    // Listen for color mode changes
    colorModeSelect.addEventListener('change', handleColorModeChange);

    // Listen for system color scheme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (colorModeSelect.value === 'system') {
            darkModeToggle.checked = e.matches;
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });

    // Load saved color mode
    const savedColorMode = localStorage.getItem('colorMode') || 'default';
    colorModeSelect.value = savedColorMode;
    
    if (savedColorMode === 'system') {
        darkModeToggle.checked = prefersDarkScheme.matches;
        document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
        darkModeToggle.disabled = true;
    } else if (savedColorMode !== 'default') {
        document.body.classList.add(`color-${savedColorMode}`);
    }

    // Add gradient color customization
    const gradientStart = document.getElementById('gradientStart');
    const gradientMiddle = document.getElementById('gradientMiddle');
    const gradientEnd = document.getElementById('gradientEnd');

    function updateGradients() {
        const gradientStyle = `linear-gradient(135deg, ${gradientStart.value}, ${gradientMiddle.value}, ${gradientEnd.value})`;
        
        // Update various gradient elements
        document.querySelector('header').style.background = gradientStyle;
        document.querySelectorAll('.close-settings, .close-websites, .close-about').forEach(button => {
            button.style.background = gradientStyle;
        });
        document.querySelector('.welcome-message').style.background = gradientStyle;
        
        // Update text gradients
        const gradientTextStyle = `
            background: ${gradientStyle};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        `;
        
        document.querySelectorAll('.github-repos-section h2, .repo-header h3').forEach(element => {
            element.style.cssText = gradientTextStyle;
        });
        
        // Save gradient preferences
        localStorage.setItem('gradientStart', gradientStart.value);
        localStorage.setItem('gradientMiddle', gradientMiddle.value);
        localStorage.setItem('gradientEnd', gradientEnd.value);
    }

    gradientStart.addEventListener('input', updateGradients);
    gradientMiddle.addEventListener('input', updateGradients);
    gradientEnd.addEventListener('input', updateGradients);

    // Load saved gradient preferences
    const savedGradientStart = localStorage.getItem('gradientStart');
    const savedGradientMiddle = localStorage.getItem('gradientMiddle');
    const savedGradientEnd = localStorage.getItem('gradientEnd');

    if (savedGradientStart) gradientStart.value = savedGradientStart;
    if (savedGradientMiddle) gradientMiddle.value = savedGradientMiddle;
    if (savedGradientEnd) gradientEnd.value = savedGradientEnd;

    if (savedGradientStart && savedGradientMiddle && savedGradientEnd) {
        updateGradients();
    }

    // Load saved settings
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    
    darkModeToggle.checked = savedDarkMode;
    if (savedDarkMode) document.body.classList.add('dark-mode');
    
    fontSizeSelect.value = savedFontSize;
    if (savedFontSize !== 'medium') {
        document.body.classList.add(`font-${savedFontSize}`);
    }
});