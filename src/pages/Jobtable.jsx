import React, { useState, useEffect } from "react";
import Modal from "react-modal";
// 1. นำเข้าไฟล์คอมโพเนนต์แบบฟอร์มที่เราแยกเขียนไว้ข้างนอก
import Insertuser from "../components/Insertuser";
import Edituser from "../components/Edituser";
import Deleteuser from "../components/Deleteuser";

// กำหนดขอบเขตให้ Modal ยึดกับ Root Element
Modal.setAppElement("#root");

const API_URL =
  "https://script.google.com/macros/s/AKfycbxtRw9wmmGzNfqRuWhWGMa8-U9Tqc0d8tdgVeMy5DC1fwGzMoZY3jaXDFahU5ib5GjQ/exec";

const Jobtable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [modalType, setModalType] = useState(""); // เก็บประเภท "insert", "edit", หรือ "delete"
  const [selectedJob, setSelectedJob] = useState(null); // เก็บข้อมูลแถวที่ผู้ใช้คลิกเลือก

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // ค่าเริ่มต้นให้แสดงทั้งหมด
  const [sortBy, setSortBy] = useState("latest"); // ค่าเริ่มต้นเรียงจากล่าสุด

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // กำหนดให้แสดงหน้าละ 10 รายการ

  const openModal = (type, job = null) => {
    setModalType(type);
    setSelectedJob(job);
    setOpen(true);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 แก้ไขจุดที่ 1 & 2: รวมฟังก์ชัน Filter และ Sort ให้เหลือรอบเดียว และเอาโค้ด Pagination ออกมาด้านนอกสโคป
  const filteredAndSortedJobs = jobs
    .filter((job) => {
      const matchesName = job.name
        ? String(job.name).toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesName && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  // 🟢 ย้ายโค้ดชุดคำนวณแบ่งหน้า Pagination ออกมาอยู่ตรงนี้ (ทำให้ทั้งแอปเข้าถึงตัวแปรเหล่านี้ได้จริง)
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // ตัดแบ่งอาเรย์ข้อมูลออกเป็นกล่องละ 10 รายการสำหรับหน้าปัจจุบัน
  const currentDisplayedJobs = filteredAndSortedJobs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Interviewing":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          รายการสมัครงาน (Job Applications)
        </h2>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* ช่อง Search บล็อกชื่อ */}
          <input
            type="text"
            placeholder="🔍 ค้นหาด้วยชื่อ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto min-w-[200px]"
          />

          {/* ช่อง Filter สถานะ */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="All">ทั้งหมดทุกสถานะ</option>
            <option value="Pending">Pending</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* ช่อง Sort เรียงลำดับวันที่ */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="latest">เรียงจาก: ใหม่ ไป เก่า</option>
            <option value="oldest">เรียงจาก: เก่า ไป ใหม่</option>
          </select>

          {/* กลุ่มปุ่มคำสั่ง */}
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            {/* <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
            >
              รีเฟรชข้อมูล
            </button> */}
            <button
              onClick={() => openModal("insert")}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          กำลังดึงข้อมูล
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-800 text-white text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 font-semibold">ชื่อ</th>
                <th className="py-4 px-6 font-semibold">เบอร์โทร</th>
                <th className="py-4 px-6 font-semibold">อีเมล</th>
                <th className="py-4 px-6 font-semibold">ตำแหน่งงาน</th>
                <th className="py-4 px-6 font-semibold">สถานะ</th>
                <th className="py-4 px-6 font-semibold">เพิ่มเติม</th>
                <th className="py-4 px-6 font-semibold">วันที่</th>
                <th className="py-4 px-6 font-semibold">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
              {/* 🟢 แก้ไขจุดที่ 3: ตรวจสอบความยาวและทำการวนลูป (map) ผ่านข้อมูลที่แบ่งหน้าแล้ว (currentDisplayedJobs) */}
              {currentDisplayedJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    ไม่พบข้อมูลผู้สมัครงานที่ตรงเงื่อนไขในตาราง
                  </td>
                </tr>
              ) : (
                currentDisplayedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {job.name || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {job.phone || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {job.email || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {job.position || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(job.status)}`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                      {job.note || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("edit", job)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => openModal("delete", job)}
                          className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* แถบควบคุมการเปลี่ยนหน้า Pagination */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
          <div className="text-sm text-gray-500">
            แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, totalItems)} จากทั้งหมด{" "}
            <span className="font-semibold text-gray-700">{totalItems}</span> รายการ
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ก่อนหน้า
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    currentPage === pageNumber
                      ? "bg-gray-800 border-gray-800 text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      {/* โครงสร้าง Popup Modal */}
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        className={`max-w-xl w-full mx-auto bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 outline-none ${modalType === "delete" ? "mt-40 max-w-sm" : "mt-20"}`}
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
      >
        {modalType === "insert" && (
          <Insertuser
            apiUrl={API_URL}
            jobs={jobs}
            onClose={() => setOpen(false)}
            onSaveSuccess={fetchJobs}
          />
        )}

        {modalType === "edit" && (
          <Edituser
            apiUrl={API_URL}
            jobData={selectedJob}
            onClose={() => setOpen(false)}
            onSaveSuccess={fetchJobs}
          />
        )}

        {modalType === "delete" && (
          <Deleteuser
            apiUrl={API_URL}
            jobData={selectedJob}
            onClose={() => setOpen(false)}
            onDeleteSuccess={fetchJobs}
          />
        )}
      </Modal>
    </div>
  );
};

export default Jobtable;