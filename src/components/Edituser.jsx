import React, { useState, useEffect } from "react";

const Edituser = ({ apiUrl, jobData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    position: "",
    status: "Pending",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ดึงข้อมูลเก่ามาใส่ในฟอร์มทันทีที่เปิดหน้าแก้ไขขึ้นมา
  useEffect(() => {
    if (jobData) {
      setFormData({
        id: jobData.id || "",
        name: jobData.name || "",
        phone: jobData.phone ? String(jobData.phone) : "", // บังคับเป็น String ตั้งแต่ตรงนี้
        email: jobData.email ? String(jobData.email) : "", // บังคับเป็น String ตั้งแต่ตรงนี้
        position: jobData.position || "",
        status: jobData.status || "Pending",
        note: jobData.note || "",
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation เบื้องต้น ---
    const nameText = String(formData.name).trim();
    const positionText = String(formData.position).trim();
    const phoneText = String(formData.phone).trim();
    const emailText = String(formData.email).trim();

    // นำตัวแปรที่แปลงเรียบร้อยแล้วมาเช็คค่าว่าง
    if (!nameText || !positionText || !phoneText || !emailText) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        action: "update", // บอกหลังบ้านให้เข้าเคส Update
        ...formData,
      };

      await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("อัปเดตข้อมูลสำเร็จ!");
      onSaveSuccess(); // รีเฟรชตาราง
      onClose(); // ปิด Modal
    } catch (error) {
      console.error("Error updating:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        แก้ไขข้อมูลพนักงาน
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-นามสกุล
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ตำแหน่งงาน
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            สถานะ
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            {/* 1. สถานะ Pending: จะเลือกอันไหนก็ได้ในระบบ */}
            {jobData.status === "Pending" && (
              <>
                <option value="Pending">Pending</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
              </>
            )}

            {/* 2. สถานะ Interviewing: ย้อนกลับไป Pending ไม่ได้แล้ว */}
            {jobData.status === "Interviewing" && (
              <>
                <option value="Interviewing">Interviewing</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
              </>
            )}

            {/* 3. สถานะ Active: เปลี่ยนเป็นอย่างอื่นไม่ได้แล้ว (นอกจากตัวมันเอง) */}
            {jobData.status === "Active" && (
              <>
                <option value="Active">
                  Active (ไม่สามารถเปลี่ยนสถานะได้แล้ว)
                </option>
              </>
            )}

            {/* 4. สถานะ Rejected: เป็นทางตัน เปลี่ยนเป็นอย่างอื่นไม่ได้แล้ว */}
            {jobData.status === "Rejected" && (
              <>
                <option value="Rejected">
                  Rejected (ไม่สามารถเปลี่ยนสถานะได้แล้ว)
                </option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            หมายเหตุเพิ่มเติม
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edituser;
