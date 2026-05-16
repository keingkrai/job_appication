import React,{useState} from 'react'

const insertuser = ({ apiUrl, jobs, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        position: "",
        note: "",
        status: "Pending",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation เช็คค่าว่าง (ของเดิมที่คุณทำไว้)
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.position.trim()) {
        alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
        return;
    }

    // 2. [เพิ่มตรงนี้] ตรวจสอบข้อมูลซ้ำกับสเตต jobs ที่ดึงมาจาก Google Sheets ไว้แล้ว
    const isDuplicatePhone = jobs.some(
    (job) => job.phone && String(job.phone).trim() === formData.phone.trim()
    );

    const isDuplicateEmail = jobs.some(
    (job) => job.email && String(job.email).trim() === formData.email.trim()
    );

    if (isDuplicatePhone) {
        alert("เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
        return; // หยุดการทำงาน ไม่ส่งไปหลังบ้าน
    }

    if (isDuplicateEmail) {
        alert("อีเมลนี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
        return; // หยุดการทำงาน ไม่ส่งไปหลังบ้าน
    }

    // หากตรวจสอบแล้วไม่ซ้ำแน่นอน จึงเริ่มส่งข้อมูล
    setIsSubmitting(true);
    
    try {
      const payload = {
        action: "insert",
        ...formData,
      };

      await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("บันทึกข้อมูลสำเร็จ!");
      onSaveSuccess(); 
      onClose();       
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };
        
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold text-gray-800 mb-4">➕ เพิ่มข้อมูลผู้สมัครงาน</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งงาน</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="Pending">Pending</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุเพิ่มเติม</label>
          <textarea name="note" value={formData.note} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
            ยกเลิก
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition">
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default insertuser
