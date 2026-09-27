/**
* Perfect Prints - Interactive Animation & UX Controller
* Master Craftsmen in Printing • Est. 1997
*/

(function() {
  "use strict";

  /**
   * Selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Event listener helper function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Scroll listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Scroll Progress Indicator
   */
  const progressBar = select('#scroll-progress');
  const updateScrollProgress = () => {
    if (progressBar) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${scrollPercent}%`;
    }
  };
  window.addEventListener('scroll', updateScrollProgress);
  window.addEventListener('load', updateScrollProgress);

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header ? header.offsetHeight : 0;
    let target = select(el);
    if (target) {
      let elementPos = target.offsetTop;
      window.scrollTo({
        top: elementPos - offset + 10,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Header scrolled class toggle
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 60) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button toggle
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 250) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll on click with class .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        if (navbarToggle) {
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader removal
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }, 200);
    });
  }

  /**
   * Interactive Gold Particle Canvas for Hero Background
   */
  const initHeroParticles = () => {
    const canvas = document.getElementById('hero-particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width, height;

    const resizeCanvas = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.5 + 0.2); // Gentle upward drift
        this.opacity = Math.random() * 0.6 + 0.2;
        this.hue = Math.random() * 20 + 35; // Gold hues (35 - 55)
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0 || this.x < 0 || this.x > width) {
          this.reset();
          this.y = height;
        }
      }

      draw() {
        ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((width * height) / 18000), 55);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    initParticles();

    let animationFrameId;
    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();
  };

  window.addEventListener('load', initHeroParticles);

  /**
   * 3D Tilt & Interactive Mouse Glow for Cards
   */
  const initCardTilt = () => {
    const cards = document.querySelectorAll('.hero-card, .service-premium-card, .workflow-step-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  };

  window.addEventListener('load', initCardTilt);

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  window.addEventListener('load', () => {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.portfolio-lightbox'
      });
    }
  });

  /**
   * Animation on scroll (AOS)
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        offset: 50
      });
    }
  });

  /**
   * PureCounter Initializer
   */
  window.addEventListener('load', () => {
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }
  });

})();