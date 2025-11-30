<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>iPasscoder | X3roe</title>
    
    <!-- 1. SMART APP BANNER -->
    <meta name="apple-itunes-app" content="app-id=1642169844">
    
    <!-- Custom Logo (Favicon) -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><style>text{fill:black} @media(prefers-color-scheme:dark){text{fill:white}}</style><text y=%22.9em%22 font-size=%2290%22 font-family=%22sans-serif%22 font-weight=%22bold%22>X</text></svg>">

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        ios: {
                            gold: '#FFD700', // Custom Gold
                            blue: '#2997FF',
                            dark: '#000000',
                            card: '#0A0A0A',
                            border: '#FFFFFF1A',
                        }
                    },
                    animation: {
                        'float': 'float 8s ease-in-out infinite',
                        'blob': 'blob 10s infinite',
                        'spin-slow': 'spin 3s linear infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-15px)' },
                        },
                        blob: {
                            '0%': { transform: 'translate(0px, 0px) scale(1)' },
                            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                            '100%': { transform: 'translate(0px, 0px) scale(1)' },
                        }
                    }
                }
            }
        }
    </script>

    <style>
        body {
            background-color: #000;
            color: #fff;
        }
        
        /* Hide scrollbar for cleaner look but keep functionality */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }

        .spotlight-card:hover::before { opacity: 1; }
        .spotlight-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: inherit;
            padding: 1px;
            background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 215, 0, 0.15), transparent 40%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
        }

        .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        .modal-enter { opacity: 0; pointer-events: none; }
        .modal-enter-active { opacity: 1; pointer-events: auto; transition: opacity 0.3s ease; }
        .modal-exit { opacity: 1; pointer-events: auto; }
        .modal-exit-active { opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
    </style>
</head>
<body class="antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-black">

    <!-- Floating Navbar -->
    <div class="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4">
        <!-- Added max-w-fit to prevent it stretching too much on mobile -->
        <nav class="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full pl-4 sm:pl-6 pr-2 py-2 flex items-center gap-3 sm:gap-6 shadow-2xl animate-fade-in-up max-w-full overflow-x-auto no-scrollbar">
            <a href="index.html" class="flex items-center gap-2 group mr-1 sm:mr-2 shrink-0">
                <i class="ph-bold ph-arrow-left text-white/50 group-hover:text-white transition-colors"></i>
                <span class="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">X3rœ</span>
            </a>
            
            <div class="h-4 w-px bg-white/10 hidden sm:block shrink-0"></div>
            
            <div class="relative flex items-center p-1 overflow-x-auto">
                <div id="nav-capsule" class="absolute bg-white rounded-full h-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-0 pointer-events-none z-0"></div>

                <a href="#hero" class="nav-link relative z-10 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">Overview</a>
                <a href="#features" class="nav-link relative z-10 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">Features</a>
                <a href="#contact" class="nav-link relative z-10 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">Support</a>
            </div>
        </nav>
    </div>

    <!-- Hero Section (White/Grey/Gold Theme) -->
    <section id="hero" class="relative min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <!-- Minimal Ambient Background - GOLD/SILVER -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] left-[20%] w-[80vw] sm:w-[50vw] h-[80vw] sm:h-[50vw] bg-gray-100/5 rounded-full blur-[80px] sm:blur-[120px] animate-blob"></div>
            <div class="absolute bottom-[-10%] right-[20%] w-[80vw] sm:w-[50vw] h-[80vw] sm:h-[50vw] bg-yellow-600/5 rounded-full blur-[80px] sm:blur-[120px] animate-blob" style="animation-delay: 2s"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <!-- App Icon with Silver/Gold Glow -->
            <div class="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-6 sm:mb-8 reveal active">
                <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-yellow-500/30 blur-2xl opacity-40 rounded-full"></div>
                <div class="relative w-full h-full bg-[#0A0A0A] rounded-[24px] sm:rounded-[28px] shadow-2xl border border-white/10 overflow-hidden">
                    <img src="ipasscoder_icon.png" alt="iPasscoder App Icon" class="w-full h-full object-cover">
                </div>
            </div>

            <div class="reveal active" style="transition-delay: 0.1s;">
                <h2 class="text-yellow-500 font-semibold tracking-widest uppercase text-[10px] sm:text-xs mb-4 border border-yellow-500/20 inline-block px-3 py-1 rounded-full bg-yellow-500/5">
                    Security & Privacy
                </h2>
                <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
                    Secure.<br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-yellow-500">Powerful. Smart.</span>
                </h1>
            </div>
            
            <p class="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed reveal active px-4" style="transition-delay: 0.2s;">
                Take control of your digital security with iPasscoder. The modern password manager designed for speed, simplicity, and privacy.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 reveal active px-4" style="transition-delay: 0.3s;">
                <a href="https://apps.apple.com/us/app/ipasscoder/id1642169844" target="_blank" class="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-yellow-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                    <i class="ph-fill ph-app-store-logo text-xl"></i>
                    Download on App Store
                </a>
                <a href="#features" class="w-full sm:w-auto px-8 py-4 bg-[#0A0A0A] text-white border border-white/10 font-semibold rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    Explore Features
                    <i class="ph-bold ph-arrow-down"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Visual Mockup Section -->
    <section class="py-12 border-y border-white/5 overflow-hidden bg-black/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative mx-auto max-w-[800px] flex justify-center items-end gap-4 sm:gap-8 perspective-1000">
                <!-- Left Phone -->
                <div class="hidden lg:block w-[260px] h-[520px] bg-[#0A0A0A] rounded-[40px] border-[8px] border-[#1A1A1A] shadow-2xl transform -rotate-y-12 translate-x-10 scale-90 opacity-60 z-0 hover:z-20 hover:scale-100 hover:opacity-100 hover:rotate-y-0 transition-all duration-500">
                    <div class="w-full h-full rounded-[32px] overflow-hidden bg-black relative flex flex-col pt-8 border border-white/5">
                        <div class="px-6 mb-4">
                            <div class="text-xs font-bold text-gray-500 uppercase">Generator</div>
                            <div class="text-xl font-bold text-white">X7#k9$mP2</div>
                        </div>
                        <div class="px-4 space-y-2">
                            <div class="h-2 bg-yellow-500 w-full rounded-full"></div>
                            <div class="text-xs text-yellow-500 font-medium text-right">Strong</div>
                        </div>
                    </div>
                </div>
                <!-- Main Phone -->
                <div class="w-[280px] sm:w-[300px] h-[560px] sm:h-[600px] bg-[#0A0A0A] rounded-[45px] border-[8px] sm:border-[10px] border-[#1A1A1A] shadow-2xl relative z-10 overflow-hidden reveal">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-6 sm:h-7 w-24 sm:w-28 bg-black rounded-b-2xl z-20"></div>
                    <div class="w-full h-full bg-black pt-12 flex flex-col">
                        <div class="px-6 mb-6">
                            <h2 class="text-2xl sm:text-3xl font-bold text-white">Vault</h2>
                            <p class="text-gray-500 text-sm flex items-center gap-1"><i class="ph-fill ph-lock-key-open text-yellow-500"></i> Unlocked</p>
                        </div>
                        <div class="flex-1 bg-[#0A0A0A] rounded-t-[32px] p-4 sm:p-6 space-y-4 border-t border-white/10">
                            <!-- Items -->
                            <div class="flex items-center gap-4 p-4 bg-black rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-colors cursor-pointer group">
                                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black text-xl group-hover:scale-110 transition-transform">
                                    <i class="ph-fill ph-github-logo"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="font-bold text-sm text-white">GitHub</div>
                                    <div class="text-xs text-gray-500">user@example.com</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 p-4 bg-black rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-colors cursor-pointer group">
                                <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-black text-xl group-hover:scale-110 transition-transform">
                                    <i class="ph-fill ph-google-logo"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="font-bold text-sm text-white">Google</div>
                                    <div class="text-xs text-gray-500">Personal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right Phone -->
                <div class="hidden lg:block w-[260px] h-[520px] bg-[#0A0A0A] rounded-[40px] border-[8px] border-[#1A1A1A] shadow-2xl transform rotate-y-12 -translate-x-10 scale-90 opacity-60 z-0 hover:z-20 hover:scale-100 hover:opacity-100 hover:rotate-y-0 transition-all duration-500">
                    <div class="w-full h-full rounded-[32px] overflow-hidden bg-black relative pt-10 px-6 border border-white/5">
                        <h3 class="text-2xl font-bold mb-6 text-white">Security</h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center"><i class="ph-fill ph-warning"></i></div>
                                <div class="flex-1">
                                    <div class="text-sm font-bold text-white">Risk Found</div>
                                    <div class="h-1.5 w-full bg-[#1C1C1E] rounded-full mt-1"><div class="h-full w-1/4 bg-yellow-600 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <!-- Ambient Background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[100px]"></div>
            <div class="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div class="text-center mb-12 sm:mb-16 reveal">
            <h2 class="text-2xl sm:text-3xl font-bold text-white">Everything you need.</h2>
            <p class="text-sm sm:text-base text-gray-400 mt-2">Powerful features wrapped in a simple design.</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <!-- Features Cards -->
            <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-magic-wand"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-yellow-500 transition-colors">Smart Generator</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Instantly create cryptographic strong passwords.</p>
            </div>
            <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-vault"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors">Password Vault</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Save, name, search, and organize your passwords.</p>
            </div>
            <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-shield-check"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-yellow-500 transition-colors">Security Audit</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Analyze strength, reuse, and potential risks.</p>
            </div>
             <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-qr-code"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors">2FA Authenticator</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Generate and manage two-factor authentication codes.</p>
            </div>
            <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-face-mask"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-yellow-500 transition-colors">Biometric Protection</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Secure with Face ID or Touch ID.</p>
            </div>
            <div class="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 overflow-hidden spotlight-card group reveal">
                <div class="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"><i class="ph-fill ph-paint-brush"></i></div>
                <h3 class="text-xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors">Modern Design</h3>
                <p class="text-gray-400 leading-relaxed text-sm">Smooth, intuitive native SwiftUI interface.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="py-16 sm:py-24 px-6 text-center border-t border-white/10">
        <div class="max-w-2xl mx-auto reveal" id="footer-cta">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Need Support?</h2>
            <a href="#" onclick="openModal(); return false;" class="text-lg sm:text-xl md:text-2xl text-gray-400 hover:text-white transition-colors border-b border-gray-800 hover:border-white pb-1">contact@x3roe.com</a>
        </div>
        <div class="mt-12 sm:mt-16 flex justify-center gap-6 sm:gap-8 flex-wrap">
            <a href="index.html" class="text-gray-500 hover:text-white transition-colors text-sm font-medium">Main Portfolio</a>
            <span class="text-gray-700">•</span>
            <a href="ipasscoder-privacy.html" class="text-gray-500 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a>
            <span class="text-gray-700">•</span>
            <a href="ipasscoder-terms.html" class="text-gray-500 hover:text-white transition-colors text-sm font-medium">Terms of Use</a>
        </div>
        <p class="mt-12 text-xs sm:text-sm text-gray-600">© 2025 Youssef Keram.</p>
    </footer>

    <!-- Contact Modal -->
    <div id="contact-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md hidden transition-all duration-300 px-4">
        <div class="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl transform transition-all duration-300 scale-95 opacity-0" id="modal-content">
            <button onclick="closeModal()" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                <i class="ph-bold ph-x text-xl"></i>
            </button>
            <h3 class="text-2xl font-bold mb-2">Get Support</h3>
            <p class="text-gray-400 mb-6 text-sm">Having issues with iPasscoder? Let us know.</p>
            <form id="contact-form" class="space-y-4" onsubmit="handleFormSubmit(event)">
                <div>
                    <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Name</label>
                    <input name="name" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="John Doe">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
                    <input name="email" type="email" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="john@example.com">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Issue Description</label>
                    <textarea name="message" rows="4" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="Describe the problem..."></textarea>
                </div>
                <button type="submit" id="submit-btn" class="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all mt-2 flex justify-center items-center gap-2"><span>Send Request</span></button>
            </form>
        </div>
    </div>

    <script>
        document.querySelectorAll('.spotlight-card').forEach(card => {
            card.onmousemove = e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // NEW SCROLL SPY LOGIC: Position Based
        const navLinks = document.querySelectorAll('.nav-link');
        const capsule = document.getElementById('nav-capsule');
        const sections = document.querySelectorAll('section[id], footer[id]');
        let isManualScroll = false;
        let scrollTimeout;

        function moveCapsuleToLink(link) {
            capsule.style.opacity = '1';
            capsule.style.left = `${link.offsetLeft}px`;
            capsule.style.width = `${link.offsetWidth}px`;
            navLinks.forEach(l => {
                l.classList.remove('text-black');
                l.classList.add('text-gray-400', 'hover:text-white');
            });
            link.classList.remove('text-gray-400', 'hover:text-white');
            link.classList.add('text-black');
        }

        // Updated Function: Uses math instead of Observer to prevent glitching
        function updateActiveSection() {
            if (isManualScroll) return;

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // 1. Bottom of Page -> Support
            if (scrollY + viewportHeight >= docHeight - 50) {
                const contactLink = document.querySelector('.nav-link[href="#contact"]');
                if(contactLink) moveCapsuleToLink(contactLink);
                return;
            }

            // 2. Top of Page -> Overview
            if (scrollY < 100) {
                const heroLink = document.querySelector('.nav-link[href="#hero"]');
                if(heroLink) moveCapsuleToLink(heroLink);
                return;
            }

            // 3. Middle Sections -> Features (or others if added later)
            // Simple center point check
            const center = scrollY + (viewportHeight / 2);
            const featuresSection = document.getElementById('features');
            
            if (featuresSection) {
                const top = featuresSection.offsetTop;
                const bottom = top + featuresSection.offsetHeight;
                
                if (center >= top && center < bottom) {
                    const featuresLink = document.querySelector('.nav-link[href="#features"]');
                    if(featuresLink) moveCapsuleToLink(featuresLink);
                } else {
                    // Fallback to Overview if above features but not top
                    if (center < top) {
                        const heroLink = document.querySelector('.nav-link[href="#hero"]');
                        if(heroLink) moveCapsuleToLink(heroLink);
                    }
                }
            }
        }

        // Use scroll event for smoother updates
        window.addEventListener('scroll', updateActiveSection);
        // Initial check
        updateActiveSection();

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                isManualScroll = true;
                clearTimeout(scrollTimeout);
                moveCapsuleToLink(e.target);
                scrollTimeout = setTimeout(() => { isManualScroll = false; }, 1000);
            });
        });

        // Contact Modal Logic
        const modal = document.getElementById('contact-modal');
        const modalContent = document.getElementById('modal-content');
        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const footerCta = document.getElementById('footer-cta');

        function openModal() {
            if (localStorage.getItem('ipass_support_sent')) return;
            modal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeModal() {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                setTimeout(resetFormState, 100);
            }, 300);
        }

        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        async function handleFormSubmit(e) {
            e.preventDefault();
            if (localStorage.getItem('ipass_support_sent')) { alert("Request already sent."); return; }

            const form = e.target;
            const formData = new FormData(form);
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph-bold ph-spinner animate-spin text-xl"></i> Sending...';
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');

            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/movozokz'; 

            try {
                try {
                    const ipRes = await fetch('https://api.ipify.org?format=json');
                    const ipData = await ipRes.json();
                    formData.append('sender_ip', ipData.ip);
                } catch (err) {}

                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.innerHTML = '<i class="ph-bold ph-check text-xl"></i> Sent!';
                    submitBtn.classList.remove('bg-white', 'text-black', 'hover:bg-gray-200');
                    submitBtn.classList.add('bg-green-500', 'text-white');
                    localStorage.setItem('ipass_support_sent', 'true');
                    setTimeout(() => {
                        closeModal();
                        if(footerCta) footerCta.innerHTML = '<h2 class="text-3xl font-bold mb-4 text-white">Request Received</h2><p class="text-xl text-gray-400">We will get back to you soon.</p>';
                    }, 1500);
                } else { throw new Error('Failed'); }
            } catch (error) {
                console.error(error);
                submitBtn.innerHTML = 'Error. Try again.';
                submitBtn.classList.add('bg-red-500', 'text-white');
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Request</span>';
                    submitBtn.classList.remove('opacity-80', 'cursor-not-allowed', 'bg-red-500', 'text-white');
                    submitBtn.classList.add('bg-white', 'text-black');
                }, 3000);
            }
        }

        function resetFormState() {
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Request</span>';
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed', 'bg-green-500', 'text-white');
            submitBtn.classList.add('bg-white', 'text-black');
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('ipass_support_sent')) {
                if(footerCta) footerCta.innerHTML = '<h2 class="text-3xl font-bold mb-4 text-white">Request Received</h2><p class="text-xl text-gray-400">We will get back to you soon.</p>';
            }
        });
    </script>
</body>
</html>

