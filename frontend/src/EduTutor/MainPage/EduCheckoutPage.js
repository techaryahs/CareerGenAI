import React, { useState } from "react";

export default function EduCheckoutPage({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all details");
      return;
    }

    // 🚀 After successful checkout
    onSuccess();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Checkout</h2>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg 
                   hover:bg-green-700 transition-all"
      >
        Pay & Confirm
      </button>
    </div>
  );
}
