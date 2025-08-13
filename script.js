document.addEventListener('DOMContentLoaded', function() {
    // API key และ URL สำหรับดึงแบนเนอร์
    const API_KEY = 'c15d4d99f487a84834bcf633521d40ca';
    const BANNER_API_URL = 'https://ramenplz.free.nf/api/get_banners.php';

    // ตัวแปรสำหรับ Carousel
    let currentSlide = 0;
    let banners = [];
    let slideInterval;

    // DOM Elements
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    // ตรวจสอบ element ก่อนใช้งาน
    if (!carousel || !prevButton || !nextButton || !dotsContainer) {
        console.error('ไม่พบ Element ที่จำเป็นในหน้าเว็บ');
        return;
    }

    // ฟังก์ชันดึงข้อมูลแบนเนอร์จาก API
    async function fetchBanners() {
        try {
            let response;
            const options = {
                headers: {
                    'X-API-KEY': API_KEY,
                    'Accept': 'application/json'
                }
            };

            // วิธีที่ 1: Header
            response = await fetch(BANNER_API_URL, options);

            // วิธีที่ 2: URL Parameter (ถ้า method 1 ล้มเหลว)
            if (!response.ok) {
                response = await fetch(`${BANNER_API_URL}?api_key=${API_KEY}`);
            }

            // ตรวจสอบ response
            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();
            return data.banners || [];

        } catch (error) {
            console.error('API Error:', error);
            // ข้อมูลสำรอง
            return [{
                imageUrl: "https://via.placeholder.com/1200x400/FF5733/FFFFFF?text=Banner+1",
                alt: "Default Banner 1"
            }];
        }
    }

    // สร้าง Carousel จากข้อมูลแบนเนอร์
    function renderCarousel() {
        // ล้าง Carousel ที่มีอยู่
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        // สร้างสไลด์และจุดนำทาง
        banners.forEach((banner, index) => {
            // สร้างสไลด์
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${banner.imageUrl}" alt="${banner.alt || 'แบนเนอร์'}">`;
            carousel.appendChild(slide);

            // สร้างจุดนำทาง
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // อัพเดทตำแหน่งสไลด์แรก
        updateCarousel();

        // เริ่มการเลื่อนอัตโนมัติ
        startAutoSlide();
    }

    // ไปยังสไลด์ที่กำหนด
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
        resetAutoSlide();
    }

    // อัพเดทตำแหน่ง Carousel
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

        // อัพเดทจุดนำทาง
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // สไลด์ถัดไป
    function nextSlide() {
        currentSlide = (currentSlide + 1) % banners.length;
        updateCarousel();
    }

    // สไลด์ก่อนหน้า
    function prevSlide() {
        currentSlide = (currentSlide - 1 + banners.length) % banners.length;
        updateCarousel();
    }

    // เริ่มการเลื่อนอัตโนมัติ
    function startAutoSlide() {
        if (banners.length > 1) {
            clearInterval(slideInterval); // เคลียร์ interval ก่อนหน้า
            slideInterval = setInterval(nextSlide, 5000); // เลื่อนทุก 5 วินาที
        }
    }

    // รีเซ็ตการเลื่อนอัตโนมัติเมื่อผู้ใช้โต้ตอบ
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

    // เริ่มต้นการทำงาน
    async function initialize() {
        banners = await fetchBanners();
        renderCarousel();

        // อัพเดทแบนเนอร์ทุก 1 นาที
        setInterval(async() => {
            banners = await fetchBanners();
            renderCarousel();
        }, 60 * 1000);
    }

    initialize();
});