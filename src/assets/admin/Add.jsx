import React, { useState } from "react";
import axios from "axios";

const AdminAddTestimonial = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/test/testimonial`, formData);
      setSuccess(true);
      setName("");
      setContent("");
      setImage(null);
    } catch (err) {
      alert("Error uploading testimonial");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Testimonial</h2>

      {success && <p className="text-green-600 mb-3">Uploaded Successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input type="text"
          placeholder="Client Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Testimonial Content"
          className="w-full border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default AdminAddTestimonial;
