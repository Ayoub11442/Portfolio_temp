<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        :root {
            --primary-color: #8e2de2;
            --secondary-color: #4a00e0;
            --text-color: #fff;
            --text-secondary: #cccccc;
            --bg-color: #000;
            --content-bg: rgba(0, 0, 0, 0.7);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            position: relative;
        }
        
        .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }
        
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 2.5rem;
            background-color: var(--content-bg);
            border-radius: 16px;
            backdrop-filter: blur(8px);
            box-shadow: 0 0 30px rgba(142, 45, 226, 0.3);
            max-width: 550px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .content:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 40px rgba(142, 45, 226, 0.5);
        }
        
        h1 {
            font-size: clamp(5rem, 15vw, 10rem);
            line-height: 1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 15px rgba(138, 43, 226, 0.6);
        }
        
        p {
            font-size: clamp(1rem, 3vw, 1.5rem);
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
            line-height: 1.4;
        }
        
        .home-btn {
            display: inline-block;
            padding: 0.9rem 2.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(74, 0, 224, 0.4);
            position: relative;
            overflow: hidden;
        }
        
        .home-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(74, 0, 224, 0.6);
        }
        
        .home-btn:active {
            transform: translateY(1px);
        }
        
        .home-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%);
        }
        
        .home-btn:hover::after {
            animation: shine 1.5s infinite;
        }
        
        @keyframes shine {
            100% {
                transform: translateX(100%);
            }
        }
        
        .planet {
            position: absolute;
            border-radius: 50%;
            z-index: 1;
            box-shadow: inset -10px -10px 40px rgba(0, 0, 0, 0.8), 
                        0 0 50px rgba(138, 43, 226, 0.5);
            opacity: 0.8;
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -15px) rotate(5deg); }
            50% { transform: translate(0, -25px) rotate(10deg); }
            75% { transform: translate(-10px, -15px) rotate(5deg); }
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 1.5rem;
                margin: 0 1rem;
            }
        }
    </style>
</head>
<body>
    <canvas class="stars" id="stars"></canvas>
    
    <div class="content">
        <h1>404</h1>
        <p>Oops! You've ventured into the void of space.</p>
        <p>The page you're looking for has drifted beyond our universe.</p>
        <button class="home-btn" id="homeBtn">Return to Earth</button>
    </div>
    
    <script>
        (() => {
            // Use immediately invoked function expression for scope isolation
            const canvas = document.getElementById('stars');
            const ctx = canvas.getContext('2d');
            const planets = [];
            let stars = [];
            let animationFrameId;
            
            // Improved performance with throttling
            function throttle(callback, delay) {
                let lastCall = 0;
                return function(...args) {
                    const now = Date.now();
                    if (now - lastCall >= delay) {
                        lastCall = now;
                        callback(...args);
                    }
                };
            }
            
            // Set canvas size with device pixel ratio
            function setupCanvas() {
                const dpr = window.devicePixelRatio || 1;
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                ctx.scale(dpr, dpr);
                
                initStars(width, height);
                createPlanets(width, height);
            }
            
            // Initialize stars with better performance
            function initStars(width, height) {
                stars = [];
                const density = width < 600 ? 700 : 1200;
                const numStars = Math.floor(width * height / density);
                
                for (let i = 0; i < numStars; i++) {
                    stars.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 1.5 + 0.5,
                        vx: (Math.random() - 0.5) * 0.2,
                        vy: (Math.random() - 0.5) * 0.2,
                        alpha: Math.random() * 0.7 + 0.3,
                        alphaChange: Math.random() * 0.005
                    });
                }
            }
            
            // Batch draw stars for better performance
            function animate() {
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                ctx.clearRect(0, 0, width, height);
                
                // Use a single path for all stars
                ctx.beginPath();
                
                stars.forEach(star => {
                    // Update star position
                    star.x += star.vx;
                    star.y += star.vy;
                    
                    // Twinkle effect
                    star.alpha += star.alphaChange;
                    if (star.alpha > 1 || star.alpha < 0.3) {
                        star.alphaChange = -star.alphaChange;
                    }
                    
                    // Efficient boundary wrapping
                    if (star.x < 0) star.x = width;
                    else if (star.x > width) star.x = 0;
                    if (star.y < 0) star.y = height;
                    else if (star.y > height) star.y = 0;
                    
                    // Add star to path
                    ctx.moveTo(star.x + star.radius, star.y);
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                    ctx.fill();
                });
                
                animationFrameId = requestAnimationFrame(animate);
            }
            
            // Create planets with efficient DOM manipulation
            function createPlanets(width, height) {
                // Remove existing planets
                planets.forEach(planet => planet.remove && planet.remove());
                planets.length = 0;
                
                // Create planet elements with document fragment for better performance
                const fragment = document.createDocumentFragment();
                const planetCount = width < 600 ? 2 : 3;
                const colors = [
                    'radial-gradient(circle at 30% 30%, #4a00e0, #000)',
                    'radial-gradient(circle at 30% 30%, #ff5e62, #2a0845)',
                    'radial-gradient(circle at 30% 20%, #36d1dc, #5b86e5)'
                ];
                
                for (let i = 0; i < planetCount; i++) {
                    const size = Math.random() * (width < 600 ? 40 : 70) + 30;
                    const planet = document.createElement('div');
                    planet.className = 'planet';
                    
                    // Set styles directly instead of individual properties
                    Object.assign(planet.style, {
                        width: `${size}px`,
                        height: `${size}px`,
                        background: colors[i % colors.length]
                    });
                    
                    // Position planets with better distribution
                    const angle = (i * (360 / planetCount) + Math.random() * 30) % 360;
                    const distance = Math.max(width, height) * 0.4;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    
                    const x = centerX + Math.cos(angle * Math.PI / 180) * distance - size / 2;
                    const y = centerY + Math.sin(angle * Math.PI / 180) * distance - size / 2;
                    
                    planet.style.left = `${x}px`;
                    planet.style.top = `${y}px`;
                    planet.style.animation = `float ${15 + i * 5 + Math.random() * 10}s infinite ease-in-out ${i * 2}s`;
                    
                    fragment.appendChild(planet);
                    planets.push(planet);
                }
                
                document.body.appendChild(fragment);
            }
            
            // Event handlers
            document.getElementById('homeBtn').addEventListener('click', () => {
                window.location.href = "/";
            });
            
            // Handle resize with efficient debounce
            const handleResize = throttle(() => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                setupCanvas();
                animate();
            }, 250);
            
            window.addEventListener('resize', handleResize);
            
            // Initialize the page
            setupCanvas();
            animate();
        })();
    </script>
</body>
</html>