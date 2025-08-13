# เว็บไซต์แบนเนอร์สไลด์

เว็บไซต์นี้แสดงแบนเนอร์แบบสไลด์ (Carousel) ที่สามารถเปลี่ยนแปลงได้ผ่าน API

## คุณสมบัติ
- แสดงแบนเนอร์แบบสไลด์อัตโนมัติ
- ปุ่มเลื่อนซ้าย-ขวา
- จุดนำทางสำหรับเลือกสไลด์
- ขนาดแบนเนอร์คงที่ (1200x400 พิกเซล)
- เปลี่ยนแบนเนอร์ผ่าน API ได้

## การติดตั้งและใช้งาน

1. โคลน repository นี้
   ```bash
   git clone https://github.com/username/banner-website.git
   ```

2. เปิดไฟล์ `index.html` ในเบราว์เซอร์

## การ deploy บน GitHub Pages

1. สร้าง repository ใหม่บน GitHub
2. อัพโหลดไฟล์ทั้งหมดไปยัง repository
3. ไปที่ Settings > Pages
4. เลือก branch ที่ต้องการ (ปกติคือ main หรือ master)
5. คลิก Save

เว็บไซต์จะถูกเผยแพร่ที่ `https://username.github.io/banner-website/`

## การปรับแต่ง API
แก้ไขค่าต่อไปนี้ในไฟล์ `script.js`:
- `API_KEY`: API key สำหรับเข้าถึงบริการ
- `BANNER_API_URL`: URL ของ API ที่ให้บริการแบนเนอร์

รูปแบบข้อมูลที่ API ควรส่งกลับ:
```json
{
    "banners": [
        {
            "imageUrl": "https://example.com/banner1.jpg",
            "alt": "คำอธิบายแบนเนอร์ 1"
        },
        {
            "imageUrl": "https://example.com/banner2.jpg",
            "alt": "คำอธิบายแบนเนอร์ 2"
        }
    ]
}
```