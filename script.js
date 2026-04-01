// Ensure the page starts at the top on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // --- Splash Screen Logic ---
  const splashScreen = document.getElementById('splash-screen');
  console.log("Splash logic loaded");
  if (splashScreen) {
    const splashLogo = document.getElementById('splash-logo');
    const splashProgress = document.getElementById('splash-progress');
    const splashBar = document.getElementById('splash-bar');

    // Trigger initial animations
    setTimeout(() => {
      if(splashLogo) splashLogo.classList.remove('translate-y-full', 'opacity-0');
    }, 100);

    // Trigger progress bar
    setTimeout(() => {
      if(splashProgress) splashProgress.classList.remove('opacity-0');
      setTimeout(() => {
        if(splashBar) splashBar.style.width = '100%';
      }, 100);
    }, 800);

    // End Splash Screen
    setTimeout(() => {
      splashScreen.style.transform = 'translateY(-100%)';
      document.body.classList.remove('overflow-hidden');
      
      setTimeout(() => {
          splashScreen.remove();
      }, 1000);
    }, 2800);
  }

  // --- Store Carousel Logic ---
  const carouselContainer = document.getElementById('store-carousel-container');
  if (carouselContainer) {
    const track = document.getElementById('store-carousel-track');
    const prevBtn = document.getElementById('store-prev');
    const nextBtn = document.getElementById('store-next');
    const items = track.children;
    const totalItems = items.length;
    let currentIndex = 0;
    let autoPlayInterval;

    const getVisibleItems = () => {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2;  // md
      return 1;                                // sm
    };

    const updateCarousel = () => {
      const visible = getVisibleItems();
      const maxIndex = Math.max(0, totalItems - visible);
      
      // Keep index in bounds on resize
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      // Calculate width to translate
      // Because we use gap-6 (1.5rem / 24px) in tailwind
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = 24; 
      const moveX = currentIndex * (itemWidth + gap);
      
      track.style.transform = `translateX(-${moveX}px)`;
    };

    const nextSlide = () => {
      const maxIndex = Math.max(0, totalItems - getVisibleItems());
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // loop back to start
      }
      updateCarousel();
    };

    const prevSlide = () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        const maxIndex = Math.max(0, totalItems - getVisibleItems());
        currentIndex = maxIndex; // loop to end
      }
      updateCarousel();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    window.addEventListener('resize', updateCarousel);

    // Auto Play
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 3500);
    };
    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
    };

    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Init
    startAutoPlay();
    // initial layout calc might need a tiny delay to ensure CSS is applied
    setTimeout(updateCarousel, 100);
  }

  // --- Sticky Header ---
  const header = document.getElementById('main-header');
  const headerContainer = document.getElementById('header-container');
  const navLinks = document.querySelectorAll('.nav-link');
  const navBrandText = document.querySelector('.nav-brand-text');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      headerContainer.classList.remove('py-5');
      headerContainer.classList.add('py-3');
      // Switch to dark text on white background
      navLinks.forEach(link => {
        link.classList.remove('text-white/80');
        link.classList.add('text-[#1A1A1A]/70');
      });
      if (navBrandText) {
        navBrandText.classList.remove('text-white');
        navBrandText.classList.add('text-[#1A1A1A]');
      }
      const menuBtnEl = document.getElementById('menu-btn');
      if (menuBtnEl) {
        menuBtnEl.classList.remove('text-white');
        menuBtnEl.classList.add('text-[#1A1A1A]');
      }
    } else {
      header.classList.remove('scrolled');
      headerContainer.classList.add('py-5');
      headerContainer.classList.remove('py-3');
      // White text on transparent over hero
      navLinks.forEach(link => {
        link.classList.add('text-white/80');
        link.classList.remove('text-[#1A1A1A]/70');
      });
      if (navBrandText) {
        navBrandText.classList.add('text-white');
        navBrandText.classList.remove('text-[#1A1A1A]');
      }
      const menuBtnEl = document.getElementById('menu-btn');
      if (menuBtnEl) {
        menuBtnEl.classList.add('text-white');
        menuBtnEl.classList.remove('text-[#1A1A1A]');
      }
    }
  });

  // --- Floating WhatsApp Button ---
  const floatingWhatsApp = document.getElementById('floating-whatsapp');
  const heroSection = document.getElementById('hero');
  const footerSection = document.querySelector('footer');
  let tooltipTimerStarted = false;

  window.addEventListener('scroll', () => {
    if (floatingWhatsApp && heroSection && footerSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const footerTop = footerSection.getBoundingClientRect().top;

      // Appears only after scrolling past hero and hides when footer is reached
      if (heroBottom < 100 && footerTop > window.innerHeight - 100) {
        floatingWhatsApp.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        floatingWhatsApp.classList.add('translate-y-0', 'opacity-100');

        // Show tooltip for 6 seconds the very first time the button appears
        if (!tooltipTimerStarted) {
          tooltipTimerStarted = true;
          const tooltip = document.getElementById('whatsapp-tooltip');
          if (tooltip) {
            tooltip.classList.remove('scale-0', 'opacity-0');
            tooltip.classList.add('scale-100', 'opacity-100');
            setTimeout(() => {
              tooltip.classList.remove('scale-100', 'opacity-100');
              tooltip.classList.add('scale-0', 'opacity-0');
            }, 6000);
          }
        }
      } else {
        floatingWhatsApp.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        floatingWhatsApp.classList.remove('translate-y-0', 'opacity-100');
      }
    }
  });

  // --- Scroll Reveal Animations ---
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuCloseOptions = document.querySelectorAll('.mobile-link');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenuCloseOptions.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- Smooth Fade Word Rotation ---
  const fadeText = document.getElementById('fade-text');
  if (fadeText) {
    const words = ["Elevate", "Transform", "Redefine", "Empower", "Master"];
    let wordIndex = 0;

    const cycleWords = () => {
      // Fade out
      fadeText.style.opacity = '0';
      fadeText.style.transform = 'translateY(8px)';
      
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        fadeText.textContent = words[wordIndex];
        
        // Fade in
        fadeText.style.opacity = '1';
        fadeText.style.transform = 'translateY(0)';
      }, 600);
    };

    // Start cycling after splash screen
    setTimeout(() => {
      setInterval(cycleWords, 3000);
    }, 4000);
  }
});
