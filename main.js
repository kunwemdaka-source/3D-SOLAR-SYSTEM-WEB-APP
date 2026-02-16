// Cosmic Explorer - Main JavaScript File
// Interactive 3D Solar System with Three.js

class SolarSystemExplorer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = {};
        this.orbits = {};
        this.selectedPlanet = null;
        this.animationSpeed = 1;
        this.isPlaying = true;
        this.realisticScale = false;
        this.planetData = this.initializePlanetData();
        
        this.init();
    }
    
    initializePlanetData() {
        return {
            mercury: {
                name: 'Mercury',
                type: 'Terrestrial Planet',
                diameter: '4,879 km',
                mass: '0.06 Earths',
                distance: '57.9 million km',
                period: '88 Earth days',
                temperature: '427°C (day) / -173°C (night)',
                atmosphere: 'Minimal',
                moons: '0',
                color: 0x8C7853,
                size: 0.38,
                distanceFromSun: 8,
                orbitSpeed: 4.15,
                description: 'Mercury is the smallest planet in our solar system and the closest to the Sun. It has extreme temperature variations due to its lack of atmosphere.'
            },
            venus: {
                name: 'Venus',
                type: 'Terrestrial Planet',
                diameter: '12,104 km',
                mass: '0.82 Earths',
                distance: '108.2 million km',
                period: '225 Earth days',
                temperature: '462°C average',
                atmosphere: 'Dense CO2',
                moons: '0',
                color: 0xFFC649,
                size: 0.95,
                distanceFromSun: 12,
                orbitSpeed: 1.62,
                description: 'Venus is Earth\'s twin in size but has a toxic atmosphere and surface temperatures hot enough to melt lead.'
            },
            earth: {
                name: 'Earth',
                type: 'Terrestrial Planet',
                diameter: '12,756 km',
                mass: '1 Earth',
                distance: '149.6 million km',
                period: '365.25 days',
                temperature: '15°C average',
                atmosphere: 'Nitrogen, Oxygen',
                moons: '1',
                color: 0x6B93D6,
                size: 1.0,
                distanceFromSun: 16,
                orbitSpeed: 1.0,
                description: 'Earth is the only known planet with life, featuring liquid water, a protective atmosphere, and a stable climate.'
            },
            mars: {
                name: 'Mars',
                type: 'Terrestrial Planet',
                diameter: '6,792 km',
                mass: '0.11 Earths',
                distance: '227.9 million km',
                period: '687 Earth days',
                temperature: '-65°C average',
                atmosphere: 'Thin CO2',
                moons: '2',
                color: 0xCD5C5C,
                size: 0.53,
                distanceFromSun: 20,
                orbitSpeed: 0.53,
                description: 'Mars is known as the Red Planet due to iron oxide on its surface. It has the largest volcano and canyon in the solar system.'
            },
            jupiter: {
                name: 'Jupiter',
                type: 'Gas Giant',
                diameter: '142,984 km',
                mass: '318 Earths',
                distance: '778.5 million km',
                period: '12 Earth years',
                temperature: '-110°C average',
                atmosphere: 'Hydrogen, Helium',
                moons: '79',
                color: 0xD2691E,
                size: 2.5,
                distanceFromSun: 28,
                orbitSpeed: 0.084,
                description: 'Jupiter is the largest planet in our solar system, with a Great Red Spot storm larger than Earth and dozens of moons.'
            },
            saturn: {
                name: 'Saturn',
                type: 'Gas Giant',
                diameter: '120,536 km',
                mass: '95 Earths',
                distance: '1.43 billion km',
                period: '29 Earth years',
                temperature: '-140°C average',
                atmosphere: 'Hydrogen, Helium',
                moons: '82',
                color: 0xDAA520,
                size: 2.2,
                distanceFromSun: 36,
                orbitSpeed: 0.034,
                description: 'Saturn is famous for its spectacular ring system made of ice and rock particles. It\'s less dense than water.'
            },
            uranus: {
                name: 'Uranus',
                type: 'Ice Giant',
                diameter: '51,118 km',
                mass: '14.5 Earths',
                distance: '2.87 billion km',
                period: '84 Earth years',
                temperature: '-195°C average',
                atmosphere: 'Hydrogen, Helium, Methane',
                moons: '27',
                color: 0x87CEEB,
                size: 1.8,
                distanceFromSun: 44,
                orbitSpeed: 0.012,
                description: 'Uranus rotates on its side and has a faint ring system. Its blue color comes from methane in its atmosphere.'
            },
            neptune: {
                name: 'Neptune',
                type: 'Ice Giant',
                diameter: '49,528 km',
                mass: '17 Earths',
                distance: '4.5 billion km',
                period: '165 Earth years',
                temperature: '-200°C average',
                atmosphere: 'Hydrogen, Helium, Methane',
                moons: '14',
                color: 0x4169E1,
                size: 1.7,
                distanceFromSun: 52,
                orbitSpeed: 0.006,
                description: 'Neptune is the windiest planet with speeds up to 2,100 km/h. It was the first planet discovered through mathematical prediction.'
            }
        };
    }
    
    async init() {
        await this.setupThreeJS();
        this.createStarfield();
        this.createSun();
        this.createPlanets();
        this.createOrbits();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        this.startAnimation();
        this.hideLoadingScreen();
        this.initWelcomeMessage();
    }
    
    async setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('solar-system-canvas'),
            antialias: true,
            alpha: true 
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Camera initial position
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);
    }
    
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: false
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8
        });
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);
        
        // Sun glow effect
        const glowGeometry = new THREE.SphereGeometry(4, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(sunGlow);
        
        // Point light from sun
        const sunLight = new THREE.PointLight(0xffffff, 2, 200);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        this.scene.add(sunLight);
    }
    
    createPlanets() {
        Object.keys(this.planetData).forEach(planetKey => {
            const planetInfo = this.planetData[planetKey];
            const size = this.realisticScale ? planetInfo.size : Math.max(planetInfo.size, 0.5);
            
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshPhongMaterial({
                color: planetInfo.color,
                shininess: 30
            });
            
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.userData = { 
                planetKey, 
                planetInfo,
                angle: Math.random() * Math.PI * 2,
                originalSize: size
            };
            
            // Position planet
            const distance = this.realisticScale ? 
                planetInfo.distanceFromSun * 2 : 
                planetInfo.distanceFromSun;
            
            planet.position.x = Math.cos(planet.userData.angle) * distance;
            planet.position.z = Math.sin(planet.userData.angle) * distance;
            
            this.scene.add(planet);
            this.planets[planetKey] = planet;
            
            // Add special effects for specific planets
            if (planetKey === 'saturn') {
                this.createSaturnRings(planet);
            }
            
            if (planetKey === 'earth') {
                this.createEarthMoon(planet);
            }
        });
    }
    
    createSaturnRings(saturnMesh) {
        const ringGeometry = new THREE.RingGeometry(
            saturnMesh.userData.originalSize * 1.5,
            saturnMesh.userData.originalSize * 2.5,
            64
        );
        
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        saturnMesh.add(rings);
    }
    
    createEarthMoon(earthMesh) {
        const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
        const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        
        moon.position.set(2, 0, 0);
        earthMesh.add(moon);
    }
    
    createOrbits() {
        Object.keys(this.planetData).forEach(planetKey => {
            const planetInfo = this.planetData[planetKey];
            const distance = this.realisticScale ? 
                planetInfo.distanceFromSun * 2 : 
                planetInfo.distanceFromSun;
            
            const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            this.scene.add(orbit);
            this.orbits[planetKey] = orbit;
        });
    }
    
    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        this.scene.add(ambientLight);
        
        // Additional directional light for better visibility
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);
    }
    
    setupControls() {
        // Simple orbital controls implementation
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!this.mouseDown) return;
            
            const deltaX = e.clientX - this.mouseX;
            const deltaY = e.clientY - this.mouseY;
            
            this.targetRotationY += deltaX * 0.01;
            this.targetRotationX += deltaY * 0.01;
            
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            const delta = e.deltaY * 0.01;
            const distance = this.camera.position.length();
            const newDistance = Math.max(10, Math.min(100, distance + delta));
            
            this.camera.position.normalize().multiplyScalar(newDistance);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handlePlanetClick(e);
        });
    }
    
    handlePlanetClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const planetMeshes = Object.values(this.planets);
        const intersects = raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            this.selectPlanet(clickedPlanet);
        }
    }
    
    selectPlanet(planetMesh) {
        // Deselect previous planet
        if (this.selectedPlanet) {
            this.selectedPlanet.scale.set(1, 1, 1);
        }
        
        // Select new planet
        this.selectedPlanet = planetMesh;
        planetMesh.scale.set(1.2, 1.2, 1.2);
        
        // Show planet information
        this.showPlanetInfo(planetMesh.userData.planetInfo);
        
        // Focus camera on planet
        this.focusCameraOnPlanet(planetMesh);
    }
    
    focusCameraOnPlanet(planetMesh) {
        const planetPosition = planetMesh.position.clone();
        const distance = 15;
        
        const targetPosition = planetPosition.clone().add(
            new THREE.Vector3(distance, distance * 0.5, distance)
        );
        
        anime({
            targets: this.camera.position,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2000,
            easing: 'easeInOutQuad'
        });
        
        anime({
            targets: this.camera,
            duration: 2000,
            easing: 'easeInOutQuad',
            update: () => {
                this.camera.lookAt(planetPosition);
            }
        });
    }
    
    showPlanetInfo(planetInfo) {
        const panel = document.getElementById('planet-info-panel');
        panel.classList.remove('translate-x-full');
        
        // Update planet information
        document.getElementById('planet-name').textContent = planetInfo.name;
        document.getElementById('planet-type').textContent = planetInfo.type;
        document.getElementById('planet-diameter').textContent = planetInfo.diameter;
        document.getElementById('planet-mass').textContent = planetInfo.mass;
        document.getElementById('planet-distance').textContent = planetInfo.distance;
        document.getElementById('planet-period').textContent = planetInfo.period;
        document.getElementById('planet-temp').textContent = planetInfo.temperature;
        document.getElementById('planet-atmosphere').textContent = planetInfo.atmosphere;
        document.getElementById('planet-moons').textContent = planetInfo.moons;
        document.getElementById('planet-description').textContent = planetInfo.description;
        
        // Update planet icon color
        const planetIcon = document.getElementById('planet-icon');
        planetIcon.style.backgroundColor = `#${planetInfo.color.toString(16).padStart(6, '0')}`;
    }
    
    hidePlanetInfo() {
        const panel = document.getElementById('planet-info-panel');
        panel.classList.add('translate-x-full');
        
        if (this.selectedPlanet) {
            this.selectedPlanet.scale.set(1, 1, 1);
            this.selectedPlanet = null;
        }
    }
    
    setupEventListeners() {
        // Control panel events
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.isPlaying = false;
            this.animationSpeed = 0;
        });
        
        document.getElementById('play-btn').addEventListener('click', () => {
            this.isPlaying = true;
            this.animationSpeed = parseFloat(document.getElementById('speed-slider').value) / 50;
        });
        
        document.getElementById('fast-forward-btn').addEventListener('click', () => {
            this.animationSpeed = Math.min(this.animationSpeed * 2, 10);
            this.updateSpeedDisplay();
        });
        
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value) / 50;
            this.updateSpeedDisplay();
        });
        
        document.getElementById('reset-view-btn').addEventListener('click', () => {
            this.resetCamera();
        });
        
        document.getElementById('scale-toggle-btn').addEventListener('click', () => {
            this.toggleScale();
        });
        
        document.getElementById('close-info-panel').addEventListener('click', () => {
            this.hidePlanetInfo();
        });
        
        document.getElementById('close-help').addEventListener('click', () => {
            document.getElementById('help-overlay').classList.add('hidden');
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.isPlaying = !this.isPlaying;
                    this.animationSpeed = this.isPlaying ? 1 : 0;
                    break;
                case 'r':
                    this.resetCamera();
                    break;
                case 'h':
                    document.getElementById('help-overlay').classList.remove('hidden');
                    break;
                case 'escape':
                    this.hidePlanetInfo();
                    document.getElementById('help-overlay').classList.add('hidden');
                    break;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    updateSpeedDisplay() {
        const speedValue = document.getElementById('speed-value');
        speedValue.textContent = `${this.animationSpeed.toFixed(1)}x`;
    }
    
    resetCamera() {
        anime({
            targets: this.camera.position,
            x: 0,
            y: 20,
            z: 40,
            duration: 2000,
            easing: 'easeInOutQuad'
        });
        
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
    }
    
    toggleScale() {
        this.realisticScale = !this.realisticScale;
        const button = document.getElementById('scale-toggle-btn');
        button.textContent = this.realisticScale ? 'Proportional Scale' : 'Realistic Scale';
        
        // Recreate planets with new scale
        Object.values(this.planets).forEach(planet => {
            this.scene.remove(planet);
        });
        
        Object.values(this.orbits).forEach(orbit => {
            this.scene.remove(orbit);
        });
        
        this.createPlanets();
        this.createOrbits();
    }
    
    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update planet positions
            if (this.isPlaying) {
                Object.keys(this.planets).forEach(planetKey => {
                    const planet = this.planets[planetKey];
                    const planetInfo = this.planetData[planetKey];
                    
                    planet.userData.angle += (planetInfo.orbitSpeed * this.animationSpeed * 0.01);
                    
                    const distance = this.realisticScale ? 
                        planetInfo.distanceFromSun * 2 : 
                        planetInfo.distanceFromSun;
                    
                    planet.position.x = Math.cos(planet.userData.angle) * distance;
                    planet.position.z = Math.sin(planet.userData.angle) * distance;
                    
                    // Rotate planet
                    planet.rotation.y += 0.01 * this.animationSpeed;
                });
            }
            
            // Update camera rotation
            this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.1;
            this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.1;
            
            const distance = this.camera.position.length();
            this.camera.position.x = Math.sin(this.currentRotationY) * Math.cos(this.currentRotationX) * distance;
            this.camera.position.y = Math.sin(this.currentRotationX) * distance;
            this.camera.position.z = Math.cos(this.currentRotationY) * Math.cos(this.currentRotationX) * distance;
            
            this.camera.lookAt(0, 0, 0);
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        anime({
            targets: loadingScreen,
            opacity: 0,
            duration: 1000,
            easing: 'easeOutQuad',
            complete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }
    
    initWelcomeMessage() {
        const typed = new Typed('#typed-welcome', {
            strings: ['Welcome to Space', 'Explore the Cosmos', 'Journey Through Our Solar System'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: false,
            showCursor: false,
            onComplete: () => {
                setTimeout(() => {
                    anime({
                        targets: '#welcome-message',
                        opacity: 0,
                        duration: 2000,
                        easing: 'easeOutQuad'
                    });
                }, 2000);
            }
        });
    }
}

// Initialize the solar system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SolarSystemExplorer();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Animate navigation on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const nav = document.querySelector('nav');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add particle effect to control panel
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = 'rgba(135, 206, 235, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            controlPanel.appendChild(particle);
        }
    }
});