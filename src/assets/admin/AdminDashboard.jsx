import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("gallery");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [category, setCategory] = useState("general");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Auth
  const token = localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Editing Client State
  const [editingClient, setEditingClient] = useState(null);
  const [editName, setEditName] = useState("");

  // Viewing existing images
  const [currentImages, setCurrentImages] = useState([]);

  // Testimonial State
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialContent, setTestimonialContent] = useState("");
  const [testimonialImage, setTestimonialImage] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchTestimonials();
  }, []);


  useEffect(() => {
    if (selectedClient && selectedClient !== "new") {
      const client = clients.find(c => c.clientName === selectedClient);
      if (client) setCurrentImages(client.images || []);
    } else {
      setCurrentImages([]);
    }
  }, [selectedClient, clients]);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients`);
      setClients(res.data.data);
    } catch (err) {
      console.error("Error fetching clients", err);
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const clientName = selectedClient === "new" ? newClientName : selectedClient;
    if (!clientName) return alert("Please select or enter a client name");

    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("category", category);
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/clients/upload`, formData, authHeader);
      setMessage("Photos uploaded successfully! New URLs are active.");
      setFiles([]);
      fetchClients();
    } catch (err) {
      setMessage("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (public_id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clients/${selectedClient}/images/${encodeURIComponent(public_id)}`, authHeader);
      setMessage("Image deleted successfully");
      fetchClients();
    } catch (err) {
      setMessage("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteClient = async (clientName) => {
    if (!window.confirm(`Are you sure you want to delete client "${clientName}" and ALL their images? This cannot be undone.`)) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clients/${clientName}`, authHeader);
      setMessage("Client and all images deleted successfully");
      fetchClients();
      if (selectedClient === clientName) setSelectedClient("");
    } catch (err) {
      setMessage("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!editingClient || !editName.trim()) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${editingClient.clientName}`, { newName: editName }, authHeader);
      setMessage("Client name updated successfully");
      setEditingClient(null);
      setEditName("");
      fetchClients();
    } catch (err) {
      setMessage("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/test/testimonial`);
      setTestimonials(res.data);
    } catch (err) {
      console.error("Error fetching testimonials", err);
    }
  };

  const handleTestimonialUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    if (editingTestimonial) {
      // Update logic
      formData.append("name", testimonialName);
      formData.append("content", testimonialContent);
      if (testimonialImage) formData.append("image", testimonialImage);

      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/test/testimonial/${editingTestimonial._id}`, formData, authHeader);
        setMessage("Testimonial updated successfully!");
        setEditingTestimonial(null);
        setTestimonialName("");
        setTestimonialContent("");
        setTestimonialImage(null);
        fetchTestimonials();
      } catch (err) {
        setMessage("Update failed: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    } else {
      // Create logic
      if (!selectedClient || selectedClient === "new") return alert("Please select an existing client for the testimonial");
      
      const clientObj = clients.find(c => c.clientName === selectedClient);
      if (!clientObj) return alert("Client not found");

      formData.append("clientId", clientObj._id);
      formData.append("name", testimonialName);
      formData.append("content", testimonialContent);
      formData.append("image", testimonialImage);

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/test/testimonial`, formData, authHeader);
        setMessage("Testimonial added successfully!");
        setTestimonialName("");
        setTestimonialContent("");
        setTestimonialImage(null);
        fetchTestimonials();
      } catch (err) {
        setMessage("Upload failed: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/test/testimonial/${id}`, authHeader);
      setMessage("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (err) {
      setMessage("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditTestimonial = (test) => {
    setEditingTestimonial(test);
    setTestimonialName(test.name);
    setTestimonialContent(test.content);
    // Note: image is handled separately via file input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">ADMIN PANEL</h1>
            <button 
                onClick={handleLogout}
                className="px-6 py-2 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-white transition-all text-xs uppercase tracking-widest"
            >
                Logout
            </button>
        </div>

        
        <div className="flex flex-wrap gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === "gallery" ? "bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
          >
            Gallery Upload
          </button>
          <button 
            onClick={() => setActiveTab("manage-clients")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === "manage-clients" ? "bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
          >
            Manage Clients
          </button>
          <button 
            onClick={() => setActiveTab("testimonials")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === "testimonials" ? "bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
          >
            Testimonials
          </button>
          <a 
            href="/admin/layout"
            className="px-8 py-3 rounded-full font-medium bg-zinc-900 text-zinc-400 hover:bg-zinc-800 transition-all duration-300 border border-white/5"
          >
            Layout & Banners →
          </a>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl mb-8 flex items-center justify-between ${message.includes("successfully") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
          >
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-zinc-500 hover:text-white">✕</button>
          </motion.div>
        )}

        {activeTab === "manage-clients" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8">
                <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white"></span>
                    EXISTING CLIENTS
                </h2>
                
                {editingClient && (
                    <div className="mb-10 p-6 bg-zinc-800/50 rounded-2xl border border-white/10">
                        <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Edit Client Name</h3>
                        <form onSubmit={handleUpdateClient} className="flex gap-4">
                            <input 
                                type="text"
                                className="flex-grow bg-black border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-white transition"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="New name"
                                required
                            />
                            <button type="submit" className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200">Update</button>
                            <button type="button" onClick={() => setEditingClient(null)} className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-700">Cancel</button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.filter(c => c.clientName !== "SYSTEM").map(client => (
                        <div key={client._id} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{client.clientName}</h3>
                                    <p className="text-zinc-500 text-xs uppercase tracking-widest">{client.images.length} Photos</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setEditingClient(client); setEditName(client.clientName); }}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-blue-600 transition"
                                        title="Edit Name"
                                    >
                                        ✎
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClient(client.clientName)}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-red-600 transition"
                                        title="Delete Client"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <div className="flex -space-x-3 mt-4 overflow-hidden">
                                {client.images.slice(0, 5).map((img, i) => (
                                    <img key={i} src={img.url} className="w-10 h-10 rounded-full border-2 border-zinc-900 object-cover" alt="" />
                                ))}
                                {client.images.length > 5 && (
                                    <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                                        +{client.images.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form Column */}
                <div>
                    {activeTab === "gallery" ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-zinc-800 h-full"
                    >
                        <form onSubmit={handleGalleryUpload} className="space-y-8">
                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Select Client</label>
                            <select 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            required
                            >
                            <option value="">Choose a client...</option>
                            <option value="SYSTEM" className="text-blue-400 font-bold">-- SYSTEM (Site Content) --</option>
                            {clients.filter(c => c.clientName !== "SYSTEM").map(client => (
                                <option key={client._id} value={client.clientName}>{client.clientName}</option>
                            ))}
                            <option value="new" className="text-green-400">+ Create New Client</option>
                            </select>
                        </div>

                        {selectedClient === "new" && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">New Client Name</label>
                            <input 
                                type="text"
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all"
                                value={newClientName}
                                onChange={(e) => setNewClientName(e.target.value)}
                                placeholder="Enter client name"
                            />
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Category / Folder</label>
                            <select 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            >
                            <optgroup label="General">
                            <option value="general">General Gallery</option>
                            <option value="banners">Home Page Banners</option>
                            <option value="cards">Featured Card Image</option>
                            </optgroup>
                            <optgroup label="Weddings">
                            <option value="wedding">Wedding Gallery</option>
                            <option value="banner_wedding">Wedding Banner</option>
                            </optgroup>
                            <optgroup label="Baby Photography">
                            <option value="baby">Baby Gallery</option>
                            <option value="banner_baby">Baby Banner</option>
                            </optgroup>
                            <optgroup label="Model Shoot">
                            <option value="model">Model Gallery</option>
                            <option value="banner_model">Model Banner</option>
                            </optgroup>
                            <optgroup label="Info Pages">
                            <option value="about">About Gallery</option>
                            <option value="banner_about">About Banner</option>
                            <option value="contact">Contact Gallery</option>
                            <option value="banner_contact">Contact Banner</option>
                            </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Images</label>
                            <div className="relative group">
                                <input 
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
                                onChange={(e) => setFiles(e.target.files)}
                                required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50 text-sm uppercase tracking-widest"
                        >
                            {loading ? "Processing..." : "Sync to Cloud Gallery"}
                        </button>
                        </form>
                    </motion.div>
                    ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-zinc-800 h-full"
                    >
                        <form onSubmit={handleTestimonialUpload} className="space-y-8">
                        {editingTestimonial ? (
                          <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-2xl mb-4 border border-white/5">
                            <span className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Editing mode</span>
                            <button onClick={() => { setEditingTestimonial(null); setTestimonialName(""); setTestimonialContent(""); setTestimonialImage(null); }} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white">Cancel</button>
                          </div>
                        ) : (
                          <div>
                              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Client Association</label>
                              <select 
                              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                              value={selectedClient}
                              onChange={(e) => setSelectedClient(e.target.value)}
                              required
                              >
                              <option value="">Choose a client...</option>
                              {clients.filter(c => c.clientName !== "SYSTEM").map(client => (
                                  <option key={client._id} value={client.clientName}>{client.clientName}</option>
                              ))}
                              </select>
                          </div>
                        )}

                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Reviewer Name</label>
                            <input 
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all"
                            value={testimonialName}
                            onChange={(e) => setTestimonialName(e.target.value)}
                            placeholder="e.g. Rahul & Sneha"
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Experience Review</label>
                            <textarea 
                            rows="4"
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-white transition-all resize-none"
                            value={testimonialContent}
                            onChange={(e) => setTestimonialContent(e.target.value)}
                            placeholder="Share their feedback..."
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">Avatar Image {editingTestimonial && "(Optional)"}</label>
                            <input 
                            type="file"
                            accept="image/*"
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
                            onChange={(e) => setTestimonialImage(e.target.files[0])}
                            required={!editingTestimonial}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50 text-sm uppercase tracking-widest"
                        >
                            {loading ? "Processing..." : editingTestimonial ? "Update Testimonial" : "Publish Testimonial"}
                        </button>
                        </form>

                    </motion.div>
                    )}
                </div>

                {/* View/Delete Column */}
                <div className="bg-zinc-900/10 p-10 rounded-[2.5rem] border border-zinc-900 flex flex-col h-[700px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-serif font-bold tracking-tight uppercase">
                            {activeTab === "testimonials" ? "Existing Testimonials" : "Active Assets"}
                        </h2>
                        {activeTab === "gallery" && selectedClient && selectedClient !== "new" && (
                            <span className="bg-white/5 text-zinc-500 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest border border-white/10">
                                {selectedClient}
                            </span>
                        )}
                    </div>

                    {activeTab === "testimonials" ? (
                        <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar flex-grow">
                            {testimonials.map((test) => (
                                <div key={test._id} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex items-start gap-4 group">
                                    <img src={test.image.url} alt="" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-white">{test.name}</h3>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditTestimonial(test)} className="text-zinc-500 hover:text-white transition">✎</button>
                                                <button onClick={() => handleDeleteTestimonial(test._id)} className="text-zinc-500 hover:text-red-500 transition">✕</button>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 text-xs line-clamp-2 italic">"{test.content}"</p>
                                    </div>
                                </div>
                            ))}
                            {testimonials.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-600 italic">
                                    No testimonials found.
                                </div>
                            )}
                        </div>
                    ) : selectedClient && selectedClient !== "new" ? (
                        <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-4 custom-scrollbar flex-grow">
                            {currentImages.map((img, idx) => (
                                <div key={idx} className="relative group rounded-3xl overflow-hidden aspect-square border border-white/5 shadow-xl">
                                    <img src={img.url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-500" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 backdrop-blur-sm">
                                        <p className="text-[10px] text-zinc-400 mb-3 uppercase tracking-[0.2em]">{img.category}</p>
                                        <button 
                                            onClick={() => handleDeleteImage(img.public_id)}
                                            className="bg-red-500/20 text-red-500 text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full border border-red-500/30 hover:bg-red-500 hover:text-white transition duration-300"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-grow text-zinc-600 italic text-center p-10">
                            <svg className="w-16 h-16 mb-6 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                            </svg>
                            <p className="max-w-[200px]">Select a client from the left to manage their creative assets.</p>
                        </div>
                    )}
                </div>

            </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1.5rem center;
          background-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
