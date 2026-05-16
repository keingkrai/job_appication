import React, {useState} from 'react'

const Deleteuser = ({ apiUrl, jobData, onClose, onDeleteSuccess }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        action: "delete", // บอกหลังบ้านให้เข้าเคส Delete
        id: jobData.id,   // ส่ง ID ของแถวที่จะลบไป
      };

      await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert(`ลบข้อมูลรหัส ${jobData.id} สำเร็จ!`);
      onDeleteSuccess(); // รีเฟรชตาราง
      onClose();         // ปิด Modal
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <span className="text-red-600 text-xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการลบข้อมูล</h3>
      <p className="text-sm text-gray-500 mb-6">
        คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ <span className="font-semibold text-gray-800">"{jobData.name}"</span> ({jobData.id})? 
        <br />การกระทำนี้ไม่สามารถย้อนกลับได้
      </p>
      
      <div className="flex justify-center space-x-2">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
          ยกเลิก
        </button>
        <button type="button" onClick={handleDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 transition">
          {isSubmitting ? "กำลังลบ..." : "ใช่, ฉันต้องการลบ"}
        </button>
      </div>
    </div>
  )
}

export default Deleteuser
