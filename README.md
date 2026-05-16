# ระบบจัดการข้อมูลผู้สมัครงาน (Job Applications Management System)

ระบบเว็บแอปพลิเคชัน (Web Application) สำหรับบริหารจัดการข้อมูลผู้สมัครงานหลังบ้าน ที่เชื่อมต่อฐานข้อมูลรูปแบบกึ่งฐานข้อมูล (Serverless) ระหว่างหน้าบ้านกับ Google Sheets ครบถ้วนตามมาตรฐานระบบ CRUD (Create, Read, Update, Delete)

---

## 🛠️ Tech Stack ที่ใช้ (Technical Architecture)

### 1. Frontend (หน้าบ้าน)
- **React (Vite):** ไลบรารีหลักในการบริหารจัดการ Component, State Management และ Lifecycle ของแอปพลิเคชัน เพื่อการตอบสนองที่รวดเร็ว (SPA)
- **Tailwind CSS:** เฟรมเวิร์ก CSS รูปแบบ Utility-first สำหรับจัดสไตล์ UI ให้สวยงาม ทันสมัย มีโครงสร้างแบบ Responsive Design รองรับการแสดงผลทุกขนาดหน้าจอ (Desktop, Tablet, Mobile)
- **React Modal:** ไลบรารีสำหรับจัดการหน้าต่าง Popup (Modal Form) ในการทำธุรกรรมเพิ่ม แก้ไข และลบข้อมูล

### 2. Backend & Database (หลังบ้าน)
- **Google Sheets:** ใช้เป็นฐานข้อมูลหลัก (Cloud Database) ในการจัดเก็บข้อมูลผู้สมัครงาน สะดวกต่อการดูภาพรวมและจัดทำรายงานต่อ
- **Google Apps Script (GAS):** ทำหน้าที่เป็น RESTful API Web Service (Backend Engine) ขับเคลื่อนด้วยสถาปัตยกรรมแยกประเภทตาม HTTP Methods (`doGet` และ `doPost`)

---

## ✨ คุณสมบัติหลักของระบบ (Key Features)

- **CRUD Operations:** เพิ่มข้อมูลพร้อมระบบ Auto-increment ID (`EMP0001`), ดึงข้อมูลมาแสดงผล, อัปเดตข้อมูล และลบข้อมูลพนักงานออกจากตาราง
- **Data Integrity & Double-layer Validation:** 
  - *หน้าบ้าน (React):* ดักจับค่าว่าง (Required Field) และแปลงประเภทข้อมูลเพื่อความปลอดภัย
  - *หลังบ้าน (GAS):* ล็อกและป้องกันการกรอกข้อมูลอีเมล (`email`) หรือเบอร์โทรศัพท์ (`phone`) ซ้ำกับฐานข้อมูลเดิมในระบบ
- **State Flow Management:** ควบคุมขั้นตอนสถานะใบสมัครงาน (`Pending` ➔ `Interviewing` ➔ `Active` / `Rejected`) ไม่ให้ผู้ใช้งานกดย้อนสถานะกลับไปยังขั้นตอนก่อนหน้า เพื่อป้องกัน Logical Error ในกระบวนการคัดเลือก
- **Real-time Search & Filter & Sort:** ค้นหาด้วยชื่อพนักงาน, กรองสถานะของใบสมัคร และเรียงลำดับวันที่สมัครล่าสุด-เก่าสุด ได้อย่างทันทีโดยประมวลผลผ่าน Client-side Memory
- **Client-side Pagination:** แบ่งหน้าการแสดงผลตารางอัตโนมัติรอบละ 10 รายการ ช่วยลดภาระการ Render ของเบราว์เซอร์เมื่อข้อมูลมีปริมาณมาก

---

## 📥 วิธีติดตั้งระบบ (Installation Guide)

1. **ดาวน์โหลดหรือคัดลอกโปรเจกต์ (Clone Repository)**
   ```bash
   git clone [https://github.com/keingkrai/job_appication](https://github.com/keingkrai/job_appication)
   cd job_appication

## 📥 วิธีใช้งาน (Installation Guide)

- npm install
- npm run dev

## วิธีเชื่อมต่อ Google Sheets และ Google Apps Script (GAS)

## ขั้นตอนที่ 1: เตรียมแผ่นงาน Google Sheets
- สร้าง Google Sheets ขึ้นมาใหม่ 1 ไฟล์ และตั้งชื่อแผ่นงาน (Sheet Name) ด้านล่างว่า "Sheet1"
- กำหนดชื่อหัวตารางในแถวแรก (Row 1) เรียงตามคอลัมน์ A ถึง H ดังนี้

  A1: id | B1: name | C1: phone | D1: email | E1: position | F1: status | G1: note | H1: created_at

### ขั้นตอนที่ 2: ตั้งค่าฝั่ง Google Apps Script
1. ที่หน้า Google Sheets ไปที่แถบเมนูด้านบน เลือก **ส่วนขยาย (Extensions)** ➔ **Apps Script**
2. ลบโค้ดเริ่มต้นออกให้หมด จากนั้นนำซอร์สโค้ดฝั่งหลังบ้าน (ที่มีฟังก์ชัน `doGet`, `doPost`, `getAllEmployees` ฯลฯ) ไปวางทั้งหมด
3. กดปุ่ม **บันทึกโปรเจกต์ (Save)** รูปแผ่นดิสก์บริเวณด้านบน

### ขั้นตอนที่ 3: เปิดบริการ Web Application URL (Deployment)
1. คลิกปุ่ม **การทำให้ใช้งานได้ (Deploy)** สีน้ำเงินที่มุมขวาบน ➔ เลือก **การทำให้ใช้งานได้ใหม่ (New deployment)**
2. คลิกรูปเฟืองด้านซ้าย เลือกประเภทเป็น **เว็บแอป (Web app)**
3. ตั้งค่าการกำหนดสิทธิ์การเข้าถึงดังนี้:
   - **คำอธิบาย (Description):** ระบุเวอร์ชัน เช่น `v1`
   - **เรียกใช้ในฐานะ (Execute as):** เลือกรันในฐานะ **ฉัน (อีเมล Google ของคุณเอง)**
   - **ผู้มีสิทธิ์เข้าถึง (Who has access):** เลือก **ทุกคน (Anyone)** *[สำคัญมาก: หากเลือกผิด สิทธิ์หน้าเว็บ React จะดึงข้อมูลไม่ได้]*
4. คลิกปุ่ม **การทำให้ใช้งานได้ (Deploy)** 
5. ระบบของ Google จะขออนุมัติสิทธิ์ในครั้งแรก ให้กด **ให้สิทธิ์เข้าถึง (Authorize access)** ➔ เลือกอีเมลของคุณ ➔ กด **Advanced (ขั้นสูง)** ➔ กด **Go to... (ไม่ปลอดภัย)** ➔ กด **Allow (อนุญาต)**
6. ทำการคัดลอก **URL ของเว็บแอป (Web app URL)** ที่ลงท้ายด้วย `/exec` มาเก็บไว้

### ขั้นตอนที่ 4: เชื่อมโยง URL เข้ากับ React
เปิดโปรเจกต์ React ในโปรแกรมเขียนโค้ดของคุณ เข้าไปที่ไฟล์ **`src/pages/Jobtable.jsx`** แล้วนำ URL ที่คัดลอกมาไปวางแทนที่ในตัวแปร `API_URL` ด้านบนสุดของไฟล์:

```javascript
const API_URL = "[https://script.google.com/macros/s/AKfycbxtRw9wmmGzNfqRu...ค](https://script.google.com/macros/s/AKfycbxtRw9wmmGzNfqRu...ค)ีย์แอปของคุณ.../exec";
