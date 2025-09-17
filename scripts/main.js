// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Mobile Plans Carousel
class MobileCarousel {
    constructor() {
        this.container = document.getElementById('mobile-plans-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentIndex = 0;
        this.cardWidth = 320; // 300px + 20px gap
        this.visibleCards = this.getVisibleCards();
        
        this.init();
        this.setupEventListeners();
        this.setupResponsive();
    }
    
    init() {
        this.updateCarousel();
        this.updateButtons();
    }
    
    getVisibleCards() {
        const containerWidth = window.innerWidth;
        if (containerWidth < 640) return 1;
        if (containerWidth < 1024) return 2;
        return 3;
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
    
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
            this.updateCarousel();
            this.updateButtons();
        });
    }
    
    getMaxIndex() {
        const totalCards = this.container.children.length;
        return Math.max(0, totalCards - this.visibleCards);
    }
    
    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateCarousel();
        this.updateButtons();
    }
    
    next() {
        this.currentIndex = Math.min(this.getMaxIndex(), this.currentIndex + 1);
        this.updateCarousel();
        this.updateButtons();
    }
    
    updateCarousel() {
        const translateX = -this.currentIndex * this.cardWidth;
        this.container.style.transform = `translateX(${translateX}px)`;
    }
    
    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.getMaxIndex();
        
        // Update button opacity
        this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.5' : '1';
        this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
    }
}

// Coverage Form Handler
class CoverageForm {
    constructor() {
        this.form = document.getElementById('coverage-form');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // CEP formatting
        const zipcodeInput = document.getElementById('zipcode');
        zipcodeInput.addEventListener('input', (e) => {
            this.formatZipcode(e.target);
        });
        
        // Phone formatting
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', (e) => {
            this.formatPhone(e.target);
        });
    }
    
    formatZipcode(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        input.value = value;
    }
    
    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length === 11) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length === 10) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        }
        input.value = value;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Create WhatsApp message
        const message = this.createWhatsAppMessage(data);
        const whatsappUrl = `https://wa.me/553190733964?text=${encodeURIComponent(message)}`;
        
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simulate processing time
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showSuccessMessage();
        }, 1000);
    }
    
    createWhatsAppMessage(data) {
        return `Olá! Gostaria de consultar a cobertura para o seguinte endereço:

📍 *Endereço:*
Rua: ${data.street}
Número: ${data.number}
CEP: ${data.zipcode}
Bairro: ${data.neighborhood}
Cidade: ${data.city}

📧 *Contato:*
E-mail: ${data.email}
Telefone: ${data.phone}

Aguardo retorno sobre a disponibilidade dos serviços.`;
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 1001;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-check-circle"></i>
                Redirecionando para WhatsApp...
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
class HeaderHandler {
    constructor() {
        this.header = document.querySelector('.header');
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
            }
        });
    }
}

// Plan Card Animations
class PlanAnimations {
    constructor() {
        this.setupHoverEffects();
        this.setupIntersectionObserver();
    }
    
    setupHoverEffects() {
        document.querySelectorAll('.plan-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('featured')) {
                    card.style.transform = 'scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        document.querySelectorAll('.plan-card, .benefit-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// WhatsApp Button Animation
class WhatsAppButton {
    constructor() {
        this.button = document.querySelector('.whatsapp-float');
        this.setupAnimations();
    }
    
    setupAnimations() {
        // Pulse animation on page load
        setTimeout(() => {
            this.button.style.animation = 'float 3s ease-in-out infinite, pulse 2s infinite';
        }, 2000);
        
        // Hide/show on scroll
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling down
                    this.button.style.transform = 'translateX(100px)';
                } else {
                    // Scrolling up
                    this.button.style.transform = 'translateX(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.setupImageOptimization();
    }
    
    setupLazyLoading() {
        // Lazy load images when they come into view
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupImageOptimization() {
        // Preload critical images
        const criticalImages = [
            // Add any critical image URLs here
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new MobileCarousel();
    new CoverageForm();
    new HeaderHandler();
    new PlanAnimations();
    new WhatsAppButton();
    new PerformanceOptimizer();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    console.log('WI-FI CONECTA+ website initialized successfully!');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Optionally send error reports to a logging service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}