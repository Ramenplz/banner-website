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
                const response = await fetch(BANNER_API_URL, {
                    headers: {
                        'X-API-KEY': API_KEY
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'ไม่สามารถดึงข้อมูลแบนเนอร์ได้');
                }

                const data = await response.json();

                if (!data || !Array.isArray(data.banners)) {
                    throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
                }

                banners = data.banners;
                renderCarousel();
                startAutoSlide();

            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);

                // สร้างข้อความแสดง error
                const errorElement = document.createElement('div');
                errorElement.className = 'api-error';
                errorElement.innerHTML = `
            <p>ไม่สามารถโหลดแบนเนอร์ได้</p>
            <p>สาเหตุ: ${error.message}</p>
            <p>ลองตรวจสอบ API Key หรือติดต่อผู้ดูแลระบบ</p>
        `;

                // แสดง error ในหน้าเว็บ
                const container = document.querySelector('.banner-container');
                container.insertBefore(errorElement, container.firstChild);

                // ใช้ข้อมูลตัวอย่างแทน
                banners = [{
                    imageUrl: 'https://via.placeholder.com/1200x400/FF0000/FFFFFF?text=Error+Loading+Banner',
                    alt: 'แบนเนอร์ผิดพลาด'
                }];
                renderCarousel();
            }
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        // แสดงข้อความผิดพลาดให้ผู้ใช้เห็น
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'ไม่สามารถโหลดแบนเนอร์ได้: ' + error.message;
        document.querySelector('.banner-container').appendChild(errorElement);

        banners = [{ imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Ju_Ipzz8pMeRUht-c-AyGNK03WhmPJalQA&s', alt: 'แบนเนอร์เริ่มต้น' }];
        renderCarousel();
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
fetchBanners();

// อัพเดทแบนเนอร์ทุก 1 นาที
setInterval(fetchBanners, 60 * 1000);
});