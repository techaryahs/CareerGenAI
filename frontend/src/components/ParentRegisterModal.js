import React, { useState } from "react";
import axios from "axios";

const ParentRegisterModal = ({ studentId, onClose }) => {
  const API = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    parentName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/auth/register-parent`, {
        ...form,
        studentId
      });

      alert("✅ Parent registered successfully");
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to register parent");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          👨‍👩‍👧 Register Parent
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="parentName"
            placeholder="Father / Mother Name"
            value={form.parentName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Parent Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentRegisterModal;
