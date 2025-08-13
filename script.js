document.addEventListener('DOMContentLoaded', function() {
    // ข้อมูลการกำหนดค่า
    const API_KEY = 'c15d4d99f487a84834bcf633521d40ca';
    const BANNER_API_URL = 'https://ramenplz.free.nf/api/get_banners.php';
    const FALLBACK_BANNER = [{
        imageUrl: "https://via.placeholder.com/1200x400/FF5733/FFFFFF?text=Banner+1",
        alt: "Default Banner 1"
    }];

    // ตัวแปรควบคุม Carousel
    let currentSlide = 0;
    let banners = [];
    let slideInterval;

    // ตรวจสอบ DOM Elements
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!carousel || !prevButton || !nextButton || !dotsContainer) {
        console.error('ไม่พบ Element ที่จำเป็นในหน้าเว็บ');
        return;
    }

    // ฟังก์ชันดึงข้อมูลแบนเนอร์
    async function fetchBanners() {
        try {
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-API-KEY': API_KEY,
                    'Accept': 'application/json'
                }
            };

            const response = await fetch(BANNER_API_URL, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.banners || FALLBACK_BANNER;

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลแบนเนอร์:', error);
            return FALLBACK_BANNER;
        }
    }

    // สร้างและอัพเดท Carousel
    function renderCarousel() {
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        banners.forEach((banner, index) => {
            // สร้างสไลด์
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${banner.imageUrl}" alt="${banner.alt || 'แบนเนอร์'}" loading="lazy">`;
            carousel.appendChild(slide);

            // สร้างจุดนำทาง
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `ไปยังสไลด์ ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        updateCarousel();
        startAutoSlide();
    }

    // ฟังก์ชันควบคุม Carousel
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
        resetAutoSlide();
    }

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % banners.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + banners.length) % banners.length;
        updateCarousel();
    }

    function startAutoSlide() {
        if (banners.length > 1) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Event Listeners
    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    // เริ่มต้นระบบ
    async function initialize() {
        try {
            banners = await fetchBanners();
            renderCarousel();

            // อัพเดทข้อมูลทุก 1 นาที
            setInterval(async() => {
                const newBanners = await fetchBanners();
                if (JSON.stringify(newBanners) !== JSON.stringify(banners)) {
                    banners = newBanners;
                    renderCarousel();
                }
            }, 60000);

        } catch (error) {
            console.error('การเริ่มต้นระบบล้มเหลว:', error);
            banners = FALLBACK_BANNER;
            renderCarousel();
        }
    }

    initialize();
});