import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllClients, getStorageSummary, uploadImages, deleteClient, deleteImage, renameClient } from "../../api/clientApi";
import { getSettings, updateSettings, uploadHeroImage, deleteHeroImage, getTestimonials, createTestimonial, deleteTestimonial, uploadSettingsImage, deleteSettingsImage } from "../../api/studioApi";
import getCroppedImg from "../../utils/cropImage";
import Cropper from "react-easy-crop";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import "../public/Home.css"; // Reuse home slider styles for preview
import "./AdminDashboard.css";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "hero", label: "Hero Slider", icon: "monitor" },
  { id: "highlights", label: "Highlights", icon: "star" },
  { id: "showcase", label: "Showcase", icon: "image" },
  { id: "clients", label: "Clients", icon: "users" },
  { id: "gallery", label: "Gallery", icon: "grid" },
  { id: "pricing", label: "Pricing", icon: "dollar-sign" },
  { id: "testimonials", label: "Testimonials", icon: "message" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function AdminDashboard() {
  const { adminInfo, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [clients, setClients] = useState([]);
  const [storage, setStorage] = useState(null);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({ clientName: "", category: "general", files: [] });
  const [settingsForm, setSettingsForm] = useState({});
  const [testimonialForm, setTestimonialForm] = useState({ clientName: "", message: "", rating: 5, eventType: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const heroInputRef = useRef(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsRes, storageRes, settingsRes, testRes] = await Promise.all([
        getAllClients(), getStorageSummary(), getSettings(), getTestimonials(),
      ]);
      setClients(clientsRes.data.data || []);
      setStorage(storageRes.data.data);
      const s = settingsRes.data.data || {};
      setSettings(s);
      setSettingsForm({
        studioName: s.studioName || "",
        tagline: s.tagline || "",
        heroTextColor: s.heroTextColor || "#ffffff",
        aboutSections: (s.aboutSections && s.aboutSections.length > 0) ? s.aboutSections : [{
          title: "The Art of Authenticity",
          text: `We believe that every frame should tell a story. Not just what it looked like, but what it felt like. At ${s.studioName || "Devi Studio"}, we discard the generic to capture the raw, unscripted beauty of your most cherished moments.`,
          imagePosition: "right",
          image: ""
        }],
        showcaseImages: s.showcaseImages || [],
        standaloneGallery: s.standaloneGallery || [],
        categoryBanners: s.categoryBanners || { wedding: "", baby: "", model: "" },
        pricingPlans: s.pricingPlans || [],
        contactEmail: s.contactEmail || "",
        contactPhone: s.contactPhone || "",
        contactAddress: s.contactAddress || "",
        "socialLinks.instagram": s.socialLinks?.instagram || "",
        "socialLinks.facebook": s.socialLinks?.facebook || "",
        "socialLinks.whatsapp": s.socialLinks?.whatsapp || "",
        logoImage: s.logoImage || "",
      });
      setTestimonials(testRes.data.data || []);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.clientName.trim() || uploadForm.files.length === 0) {
      return showToast("Client name and files are required", "error");
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("clientName", uploadForm.clientName.trim());
    fd.append("category", uploadForm.category);
    uploadForm.files.forEach(f => fd.append("images", f));
    try {
      await uploadImages(fd);
      showToast(`${uploadForm.files.length} photo(s) uploaded!`);
      setUploadForm({ clientName: "", category: "general", files: [] });
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClient = async (clientName) => {
    if (!confirm(`Delete all photos for "${clientName}"? This cannot be undone.`)) return;
    try {
      await deleteClient(clientName);
      showToast(`Client "${clientName}" deleted`);
      loadData();
    } catch { showToast("Delete failed", "error"); }
  };

  const handleDeleteImage = async (clientName, imageId) => {
    try {
      await deleteImage(clientName, imageId);
      showToast("Image deleted");
      loadData();
    } catch { showToast("Delete failed", "error"); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...settingsForm };
      payload.socialLinks = {
        instagram: payload["socialLinks.instagram"],
        facebook: payload["socialLinks.facebook"],
        whatsapp: payload["socialLinks.whatsapp"],
      };
      delete payload["socialLinks.instagram"];
      delete payload["socialLinks.facebook"];
      delete payload["socialLinks.whatsapp"];
      await updateSettings(payload);
      showToast("Settings saved!");
      loadData();
    } catch { showToast("Failed to save settings", "error"); }
  };

  const handleCropFileChange = (e, targetConfig) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropTarget(targetConfig);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input
  };

  const handleUploadCroppedImage = async () => {
    try {
      setHeroUploading(true);
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      const fd = new FormData();
      const file = new File([croppedBlob], `cropped_${Date.now()}.jpg`, { type: "image/jpeg" });
      fd.append("image", file);
      
      const extractKey = (url) => url ? url.split('.r2.dev/')[1] : null;

      if (cropTarget?.type === 'hero') {
        await uploadHeroImage(fd);
        showToast("Hero image cropped and published!");
        loadData();
      } else if (cropTarget?.type === 'about') {
        const res = await uploadSettingsImage(fd);
        const newAbout = [...(settingsForm.aboutSections || [])];
        const oldUrl = newAbout[cropTarget.index].image;
        if (oldUrl) {
          const oldKey = extractKey(oldUrl);
          if (oldKey) try { await deleteSettingsImage(oldKey); } catch (e) { console.error(e); }
        }
        newAbout[cropTarget.index].image = res.data.data.url;
        const newSettings = { ...settingsForm, aboutSections: newAbout };
        setSettingsForm(newSettings);
        await updateSettings(newSettings);
        showToast("Highlight image cropped and saved!");
      } else if (cropTarget?.type === 'logo') {
        const res = await uploadSettingsImage(fd);
        const oldUrl = settingsForm.logoImage;
        if (oldUrl) {
          const oldKey = extractKey(oldUrl);
          if (oldKey) try { await deleteSettingsImage(oldKey); } catch (e) { console.error(e); }
        }
        const newSettings = { ...settingsForm, logoImage: res.data.data.url };
        setSettingsForm(newSettings);
        await updateSettings(newSettings);
        showToast("Logo image cropped and saved!");
      } else if (cropTarget?.type === 'banner') {
        const res = await uploadSettingsImage(fd);
        const oldUrl = settingsForm.categoryBanners?.[cropTarget.category];
        if (oldUrl) {
          const oldKey = extractKey(oldUrl);
          if (oldKey) try { await deleteSettingsImage(oldKey); } catch (e) { console.error(e); }
        }
        const newSettings = {
          ...settingsForm,
          categoryBanners: { ...settingsForm.categoryBanners, [cropTarget.category]: res.data.data.url }
        };
        setSettingsForm(newSettings);
        await updateSettings(newSettings);
        showToast(`${cropTarget.category} banner cropped and saved!`);
      }
      setCropModalOpen(false);
    } catch (err) {
      showToast("Failed to crop/upload image", "error");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleDeleteHero = async (id) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      await deleteHeroImage(id);
      showToast("Hero image deleted!");
      loadData();
    } catch {
      showToast("Failed to delete hero image", "error");
    }
  };

  const handleAddAboutSection = () => {
    if (settingsForm.aboutSections?.length >= 5) {
      return showToast("Maximum 5 highlights allowed", "error");
    }
    const newSections = [...(settingsForm.aboutSections || [])];
    newSections.push({ title: "", text: "", image: "", imagePosition: "right" });
    setSettingsForm({ ...settingsForm, aboutSections: newSections });
  };

  const handleUpdateAboutSection = (index, field, value) => {
    const newSections = [...settingsForm.aboutSections];
    newSections[index][field] = value;
    setSettingsForm({ ...settingsForm, aboutSections: newSections });
  };

  const handleRemoveAboutSection = async (index) => {
    const newSections = [...settingsForm.aboutSections];
    const removed = newSections.splice(index, 1)[0];
    
    if (removed && removed.image) {
      const oldKey = removed.image.split('.r2.dev/')[1];
      if (oldKey) try { await deleteSettingsImage(oldKey); } catch (e) {}
    }

    const newSettings = { ...settingsForm, aboutSections: newSections };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
    showToast("Highlight removed and saved!");
  };

  const handleUploadAboutImage = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await uploadSettingsImage(fd);
      handleUpdateAboutSection(index, "image", res.data.data.url);
      showToast("Highlight image uploaded!");
    } catch {
      showToast("Failed to upload image", "error");
    }
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await uploadSettingsImage(fd);
      setSettingsForm({ ...settingsForm, logoImage: res.data.data.url });
      showToast("Logo image uploaded!");
    } catch {
      showToast("Failed to upload logo", "error");
    }
  };

  const handleRemoveLogo = async () => {
    if (settingsForm.logoImage) {
      const oldKey = settingsForm.logoImage.split('.r2.dev/')[1];
      if (oldKey) try { await deleteSettingsImage(oldKey); } catch (e) {}
    }
    const newSettings = { ...settingsForm, logoImage: "" };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
    showToast("Logo removed and saved!");
  };

  const handleUploadShowcase = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    showToast("Uploading images...", "success");
    try {
      const newImages = [...(settingsForm.showcaseImages || [])];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await uploadSettingsImage(fd);
        newImages.push({ url: res.data.data.url, key: res.data.data.key });
      }
        const newSettings = { ...settingsForm, showcaseImages: newImages };
        setSettingsForm(newSettings);
        await updateSettings(newSettings);
        showToast("Showcase images uploaded and saved!");
    } catch {
      showToast("Failed to upload showcase images", "error");
    }
  };

  const handleRemoveShowcaseImage = async (index) => {
    const newImages = [...settingsForm.showcaseImages];
    const removed = newImages.splice(index, 1)[0];
    if (removed && removed.key) {
      try { await deleteSettingsImage(removed.key); } catch (e) { console.error(e); }
    }
    const newSettings = { ...settingsForm, showcaseImages: newImages };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
    showToast("Showcase image removed and saved!");
  };

  const handleUploadStandaloneGallery = async (category, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    showToast("Uploading gallery images...", "success");
    try {
      const newImages = [...(settingsForm.standaloneGallery || [])];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await uploadSettingsImage(fd);
        newImages.push({ url: res.data.data.url, key: res.data.data.key, category });
      }
      const newSettings = { ...settingsForm, standaloneGallery: newImages };
      setSettingsForm(newSettings);
      await updateSettings(newSettings);
      showToast("Gallery images uploaded and saved!");
    } catch {
      showToast("Failed to upload gallery images", "error");
    }
  };

  const handleRemoveStandaloneImage = async (index) => {
    const newImages = [...settingsForm.standaloneGallery];
    const removed = newImages.splice(index, 1)[0];
    if (removed && removed.key) {
      try { await deleteSettingsImage(removed.key); } catch (e) { console.error(e); }
    }
    const newSettings = { ...settingsForm, standaloneGallery: newImages };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
    showToast("Gallery image removed and saved!");
  };

  const handleUploadCategoryBanner = async (category, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await uploadSettingsImage(fd);
      setSettingsForm({
        ...settingsForm,
        categoryBanners: { ...settingsForm.categoryBanners, [category]: res.data.data.url }
      });
      showToast(`${category} banner uploaded!`);
    } catch {
      showToast("Failed to upload banner", "error");
    }
  };

  const handleAddPricingPlan = () => {
    setSettingsForm({
      ...settingsForm,
      pricingPlans: [...(settingsForm.pricingPlans || []), { category: "wedding", name: "", price: "", features: [""], popular: false }]
    });
  };

  const handleUpdatePricingPlan = (index, field, value) => {
    const plans = [...(settingsForm.pricingPlans || [])];
    plans[index][field] = value;
    setSettingsForm({ ...settingsForm, pricingPlans: plans });
  };

  const handleRemovePricingPlan = async (index) => {
    const plans = [...(settingsForm.pricingPlans || [])];
    plans.splice(index, 1);
    const newSettings = { ...settingsForm, pricingPlans: plans };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
    showToast("Pricing plan removed and saved!");
  };

  const handleAddPricingFeature = (planIndex) => {
    const plans = [...(settingsForm.pricingPlans || [])];
    plans[planIndex].features.push("");
    setSettingsForm({ ...settingsForm, pricingPlans: plans });
  };

  const handleUpdatePricingFeature = (planIndex, featureIndex, value) => {
    const plans = [...(settingsForm.pricingPlans || [])];
    plans[planIndex].features[featureIndex] = value;
    setSettingsForm({ ...settingsForm, pricingPlans: plans });
  };

  const handleRemovePricingFeature = async (planIndex, featureIndex) => {
    const plans = [...(settingsForm.pricingPlans || [])];
    plans[planIndex].features.splice(featureIndex, 1);
    const newSettings = { ...settingsForm, pricingPlans: plans };
    setSettingsForm(newSettings);
    await updateSettings(newSettings);
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      await createTestimonial(testimonialForm);
      showToast("Testimonial added!");
      setTestimonialForm({ clientName: "", message: "", rating: 5, eventType: "" });
      loadData();
    } catch { showToast("Failed to add testimonial", "error"); }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      await deleteTestimonial(id);
      showToast("Testimonial deleted");
      loadData();
    } catch { showToast("Delete failed", "error"); }
  };

  const percent = storage?.percent || 0;

  return (
    <div className="admin-dash">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">DS</div>
          <div>
            <div className="admin-sidebar__name">Devi Studio</div>
            <div className="admin-sidebar__role">Admin Portal</div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <AdminIcon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        {storage && (
          <div className="admin-sidebar__storage">
            <div className="storage-bar__label">
              <span>Storage</span>
              <span>{storage.storageUsedFormatted} / {storage.storageLimitFormatted}</span>
            </div>
            <div className="storage-bar__track">
              <div
                className={`storage-bar__fill ${percent > 90 ? "danger" : percent > 70 ? "warning" : ""}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="storage-bar__percent">{percent}% used</div>
            {percent > 90 && (
              <p className="storage-bar__warn">⚠️ Storage almost full! Delete old photos.</p>
            )}
          </div>
        )}

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{adminInfo?.username?.charAt(0)?.toUpperCase()}</div>
            <span>{adminInfo?.username}</span>
          </div>
          <button className="btn btn-ghost admin-sidebar__logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Toast */}
        {toast && (
          <div className={`admin-toast admin-toast--${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="spinner" style={{ width: 36, height: 36 }} />
            <span>Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* ── Overview ─────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Overview</h1>
                  <p className="admin-panel__sub">Welcome back, {adminInfo?.username}</p>
                </div>

                <div className="admin-stats">
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">
                      <AdminIcon name="users" />
                    </div>
                    <div className="admin-stat-card__val">{clients.length}</div>
                    <div className="admin-stat-card__label">Total Clients</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">
                      <AdminIcon name="image" />
                    </div>
                    <div className="admin-stat-card__val">
                      {clients.reduce((s, c) => s + (c.images?.length || 0), 0)}
                    </div>
                    <div className="admin-stat-card__label">Total Photos</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">
                      <AdminIcon name="star" />
                    </div>
                    <div className="admin-stat-card__val">{testimonials.length}</div>
                    <div className="admin-stat-card__label">Testimonials</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">
                      <AdminIcon name="grid" />
                    </div>
                    <div className="admin-stat-card__val">{percent}%</div>
                    <div className="admin-stat-card__label">Storage Used</div>
                  </div>
                </div>

                <div className="admin-recent">
                  <h2 className="admin-section-title">Recent Clients</h2>
                  <div className="admin-client-list">
                    {clients.slice(0, 5).map(c => (
                      <div key={c._id} className="admin-client-row">
                        <div className="admin-client-row__avatar">{c.clientName.charAt(0)}</div>
                        <div className="admin-client-row__info">
                          <div className="admin-client-row__name">{c.clientName}</div>
                          <div className="admin-client-row__meta">{c.images?.length || 0} photos</div>
                        </div>
                        <a
                          href={`/client/${encodeURIComponent(c.clientName)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline"
                          style={{ fontSize: "0.78rem", padding: "0.4rem 0.9rem" }}
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Hero Slider ────────────────────────────────────────── */}
            {activeTab === "hero" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Hero Slider Management</h1>
                  <p className="admin-panel__sub">Upload images and adjust text colors for the homepage 3D slider.</p>
                </div>

                <div className="admin-card" style={{ marginBottom: "2rem" }}>
                  <h3 className="admin-section-title">Hero Text & Overlay Color</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>
                    Customize the main title, subtitle (tagline), and their color.
                  </p>
                  <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <label className="input-label">Main Title</label>
                        <input type="text" className="input" placeholder="e.g. DEVI STUDIO" value={settingsForm.studioName || ""} onChange={e => setSettingsForm({ ...settingsForm, studioName: e.target.value })} />
                      </div>
                      <div style={{ flex: 2, minWidth: "300px" }}>
                        <label className="input-label">Subtitle (Tagline)</label>
                        <input type="text" className="input" placeholder="e.g. Capturing moments that last forever" value={settingsForm.tagline || ""} onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Text Color</label>
                        <input type="color" className="input" value={settingsForm.heroTextColor || "#ffffff"} style={{ padding: "0.2rem", height: "48px", width: "100px", cursor: "pointer", marginTop: "0.2rem" }} onChange={e => setSettingsForm({ ...settingsForm, heroTextColor: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <button type="submit" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
                        Save Hero Text
                      </button>
                    </div>
                  </form>
                </div>

                <div className="admin-card" style={{ marginBottom: "2rem", padding: "1rem" }}>
                  <h3 className="admin-section-title" style={{ marginBottom: "1rem" }}>Live Slider Preview</h3>
                  
                  {/* Reuse the exact Swiper implementation from Home.jsx for accurate live preview */}
                  <div className="home-hero" style={{ height: "450px", borderRadius: "12px", minHeight: "450px", position: "relative" }}>
                    <Swiper
                      key={`preview-swiper-${settings?.heroImages?.length || 0}`}
                      effect={'coverflow'}
                      grabCursor={true}
                      centeredSlides={true}
                      slidesPerView={'auto'}
                      loop={true}
                      coverflowEffect={{ rotate: 20, stretch: 0, depth: 300, modifier: 1, slideShadows: true }}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      modules={[EffectCoverflow, Autoplay]}
                      style={{ width: "100%", height: "100%" }}
                    >
                      {((settings?.heroImages?.length > 0 && settings.heroImages.length < 5) 
                        ? [...settings.heroImages, ...settings.heroImages, ...settings.heroImages].slice(0, 6) 
                        : (settings?.heroImages || [{ url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" }, { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" }, { url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80" }])).map((img, idx) => (
                        <SwiperSlide key={`preview-${img._id || 'hero'}-${idx}`}>
                          <div className="slide-image-wrapper">
                            <img src={img.url} alt="Hero" className="slide-image" />
                            <div className="slide-overlay" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="hero-content-overlay" style={{ pointerEvents: "none" }}>
                      <h1 className="title-hero" style={{ color: settingsForm.heroTextColor || "var(--text-primary)" }}>
                        {settingsForm.studioName || "DEVI STUDIO"}
                      </h1>
                      <p className="subtitle" style={{ marginTop: '1rem', color: settingsForm.heroTextColor || 'var(--accent)' }}>
                        {settingsForm.tagline || "Capturing moments that last forever"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-section-title">Manage Slider Images</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {(settings?.heroImages || []).map((img, i) => (
                      <div key={img._id || i} className="client-card" style={{ padding: "0.5rem" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "8px", overflow: "hidden" }}>
                          <img src={img.url} alt="Hero" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Slide {i + 1}</span>
                          <button className="btn-danger" style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem" }} onClick={() => handleDeleteHero(img._id)}>Remove</button>
                        </div>
                      </div>
                    ))}
                    {(!settings?.heroImages || settings.heroImages.length === 0) && (
                      <div className="admin-empty">No custom hero images. Placeholders are active.</div>
                    )}
                  </div>

                  <h3 className="admin-section-title">Upload New Image</h3>
                  <div
                    className="upload-dropzone"
                    onClick={() => heroInputRef.current?.click()}
                  >
                    <input
                      ref={heroInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleCropFileChange(e, { type: 'hero', aspect: 16/9 })}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span>Click to select an image to crop and publish</span>
                  </div>
                </div>


              </div>
            )}

            {/* ── Highlights (About) ─────────────────────────────── */}
            {activeTab === "highlights" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Studio Highlights</h1>
                  <p className="admin-panel__sub">Add up to 5 highlight sections describing your studio's story, vision, or services.</p>
                </div>

                <div className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 className="admin-section-title" style={{ margin: 0 }}>Highlight Sections ({(settingsForm.aboutSections || []).length}/5)</h3>
                    <button className="btn-primary" onClick={handleAddAboutSection} disabled={(settingsForm.aboutSections || []).length >= 5} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                      + Add New Highlight
                    </button>
                  </div>

                  {(settingsForm.aboutSections || []).map((sec, i) => (
                    <div key={i} style={{ background: "var(--dark-bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", color: "var(--gold)" }}>Section {i + 1}</h4>
                        <button className="btn-danger" style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem" }} onClick={() => handleRemoveAboutSection(i)}>Remove Section</button>
                      </div>
                      
                      <div className="upload-form__row">
                        <div className="upload-form__field">
                          <label className="input-label">Title</label>
                          <input className="input" placeholder="e.g. The Art of Authenticity" value={sec.title} onChange={(e) => handleUpdateAboutSection(i, "title", e.target.value)} />
                        </div>
                        <div className="upload-form__field" style={{ maxWidth: "200px" }}>
                          <label className="input-label">Image Position</label>
                          <select className="select" value={sec.imagePosition} onChange={(e) => handleUpdateAboutSection(i, "imagePosition", e.target.value)}>
                            <option value="left">Image on Left</option>
                            <option value="right">Image on Right</option>
                          </select>
                        </div>
                      </div>

                      <div className="upload-form__row" style={{ marginTop: "1rem" }}>
                        <div className="upload-form__field" style={{ flex: 2 }}>
                          <label className="input-label">Description Text</label>
                          <textarea className="input" rows="4" placeholder="Write your story..." value={sec.text} onChange={(e) => handleUpdateAboutSection(i, "text", e.target.value)} />
                        </div>
                        <div className="upload-form__field" style={{ flex: 1 }}>
                          <label className="input-label">Image</label>
                          {sec.image ? (
                            <div style={{ position: "relative", width: "100%", paddingBottom: "60%", borderRadius: "8px", overflow: "hidden", marginBottom: "0.5rem" }}>
                              <img src={sec.image} alt="Preview" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ) : (
                            <div style={{ width: "100%", paddingBottom: "60%", background: "rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--muted)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>No Image</span>
                            </div>
                          )}
                          <label className="btn-outline" style={{ display: "block", textAlign: "center", cursor: "pointer", fontSize: "0.8rem", padding: "0.4rem" }}>
                            Upload Image
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleCropFileChange(e, { type: 'about', index: i, aspect: 16/9 })} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {settingsForm.aboutSections?.length > 0 && (
                    <button className="btn-gold" style={{ marginTop: "1rem" }} onClick={handleSaveSettings}>Save Highlights</button>
                  )}
                  {(!settingsForm.aboutSections || settingsForm.aboutSections.length === 0) && (
                    <div className="admin-empty">No highlights added yet. Click "Add New Highlight" to start.</div>
                  )}
                </div>
              </div>
            )}

            {/* ── Showcase (Homepage Grid) ─────────────────────────────── */}
            {activeTab === "showcase" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Homepage Client Showcase</h1>
                  <p className="admin-panel__sub">Upload and manage the handpicked featured photos shown in the 3D grid on the homepage.</p>
                </div>

                <div className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 className="admin-section-title" style={{ margin: 0 }}>Featured Photos</h3>
                    <label className="btn-primary" style={{ cursor: "pointer", padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                      + Upload Photos
                      <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUploadShowcase} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {(settingsForm.showcaseImages || []).map((img, i) => (
                      <div key={i} className="client-card" style={{ padding: "0.5rem" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", borderRadius: "8px", overflow: "hidden" }}>
                          <img src={img.url} alt="Showcase" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                          <button className="btn-danger" style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem" }} onClick={() => handleRemoveShowcaseImage(i)}>Remove</button>
                        </div>
                      </div>
                    ))}
                    {(!settingsForm.showcaseImages || settingsForm.showcaseImages.length === 0) && (
                      <div className="admin-empty" style={{ gridColumn: "1 / -1" }}>No showcase images added. The homepage will automatically pick recent client photos.</div>
                    )}
                  </div>

                  {settingsForm.showcaseImages?.length > 0 && (
                    <button className="btn-gold" onClick={handleSaveSettings}>Save Showcase Selection</button>
                  )}
                </div>
              </div>
            )}

            {/* ── Clients / Upload ─────────────────────────────────── */}
            {activeTab === "clients" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Client Manager</h1>
                </div>

                {/* Upload Form */}
                <div className="admin-card">
                  <h2 className="admin-section-title">Upload Photos</h2>
                  <form onSubmit={handleUpload} className="upload-form">
                    <div className="upload-form__row">
                      <div className="upload-form__field">
                        <label className="input-label">Client Name</label>
                        <input
                          className="input"
                          placeholder="e.g. Priya & Arjun"
                          value={uploadForm.clientName}
                          onChange={e => setUploadForm({ ...uploadForm, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">Category</label>
                        <select
                          className="select"
                          value={uploadForm.category}
                          onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                        >
                          <option value="general">General</option>
                          <option value="wedding">Wedding</option>
                          <option value="baby">Baby</option>
                          <option value="model">Model</option>
                        </select>
                      </div>
                    </div>

                    <div
                      className="upload-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => setUploadForm({ ...uploadForm, files: Array.from(e.target.files) })}
                      />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      {uploadForm.files.length > 0 ? (
                        <span className="upload-dropzone__selected">{uploadForm.files.length} file(s) selected</span>
                      ) : (
                        <span>Click to select images (max 20 at once)</span>
                      )}
                    </div>

                    <button type="submit" className="btn btn-gold" disabled={uploading}>
                      {uploading ? (
                        <><div className="spinner" style={{ width: 16, height: 16 }} /> Uploading...</>
                      ) : (
                        "Upload Photos"
                      )}
                    </button>
                  </form>
                </div>

                {/* Client List */}
                <h2 className="admin-section-title" style={{ marginTop: "2rem" }}>All Clients ({clients.length})</h2>
                {clients.length === 0 ? (
                  <div className="admin-empty">No clients yet. Upload some photos above!</div>
                ) : (
                  <div className="admin-clients-grid">
                    {clients.map(client => (
                      <div key={client._id} className="client-card">
                        <div className="client-card__header">
                          <div className="client-card__avatar">{client.clientName.charAt(0)}</div>
                          <div>
                            <div className="client-card__name">{client.clientName}</div>
                            <div className="client-card__meta">{client.images?.length || 0} photos</div>
                          </div>
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", marginLeft: "auto" }}
                            onClick={() => handleDeleteClient(client.clientName)}
                          >
                            Delete All
                          </button>
                        </div>

                        <div className="client-card__link">
                          <span className="input-label">Gallery Link:</span>
                          <div className="client-card__link-row">
                            <code>{window.location.origin}/client/{encodeURIComponent(client.clientName)}</code>
                            <button
                              className="btn btn-ghost"
                              style={{ fontSize: "0.72rem", padding: "0.3rem 0.6rem" }}
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/client/${encodeURIComponent(client.clientName)}`);
                                showToast("Link copied!");
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <div className="client-card__images">
                          {client.images?.slice(0, 6).map(img => (
                            <div key={img._id} className="client-img-thumb">
                              <img src={img.url} alt="" />
                              <button
                                className="client-img-thumb__del"
                                onClick={() => handleDeleteImage(client.clientName, img._id)}
                                aria-label="Delete image"
                              >×</button>
                            </div>
                          ))}
                          {client.images?.length > 6 && (
                            <div className="client-img-more">+{client.images.length - 6}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Gallery ──────────────────────────────────────────── */}
            {activeTab === "gallery" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Portfolio Gallery</h1>
                  <p className="admin-panel__sub">Upload banner images and standalone photos for the public portfolio pages.</p>
                </div>
                <div className="gallery-overview">
                  {["wedding", "baby", "model"].map(cat => {
                    const standaloneImgs = (settingsForm.standaloneGallery || []).filter(i => i.category === cat);
                    const clientImgs = clients.flatMap(c => (c.images || []).filter(i => i.category === cat));
                    const totalImgs = standaloneImgs.length + clientImgs.length;
                    const banner = settingsForm.categoryBanners?.[cat];

                    return (
                      <div key={cat} className="admin-card gallery-cat-card" style={{ padding: "2rem" }}>
                        <div className="gallery-cat-card__header" style={{ marginBottom: "1.5rem" }}>
                          <h3 className="gallery-cat-card__title" style={{ fontSize: "1.5rem" }}>{cat.charAt(0).toUpperCase() + cat.slice(1)} Portfolio</h3>
                          <span className="badge badge-gold">{totalImgs} Total Photos</span>
                        </div>
                        
                        <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
                          {/* Banner Section */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                              <h4 style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Page Banner</h4>
                              <label className="btn-outline" style={{ cursor: "pointer", fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}>
                                {banner ? "Change Banner" : "Upload Banner"}
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleCropFileChange(e, { type: 'banner', category: cat, aspect: 21/9 })} />
                              </label>
                            </div>
                            <div style={{ width: "100%", height: "120px", borderRadius: "8px", background: "var(--dark-2)", border: "1px dashed var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {banner ? <img src={banner} alt={`${cat} banner`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>No banner set</span>}
                            </div>
                          </div>

                          {/* Standalone Images Section */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Direct Uploads</h4>
                              <label className="btn-primary" style={{ cursor: "pointer", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                                + Add Photos
                                <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleUploadStandaloneGallery(cat, e)} />
                              </label>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem" }}>
                              {(settingsForm.standaloneGallery || []).map((img, i) => img.category === cat && (
                                <div key={i} style={{ position: "relative", width: "100%", paddingBottom: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                  <img src={img.url} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                  <button onClick={() => handleRemoveStandaloneImage(i)} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(220,53,69,0.9)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✕</button>
                                </div>
                              ))}
                              {standaloneImgs.length === 0 && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", gridColumn: "1/-1" }}>No direct uploads. (Client photos will still appear here).</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: "2rem" }}>
                  <button className="btn-gold" onClick={handleSaveSettings}>Save Gallery Settings</button>
                </div>
              </div>
            )}

            {/* ── Pricing ────────────────────────────────────────────── */}
            {activeTab === "pricing" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Pricing Plans</h1>
                  <p className="admin-panel__sub">Configure packages and pricing for different categories.</p>
                </div>
                <div className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h3 className="admin-section-title" style={{ margin: 0 }}>Plans</h3>
                    <button className="btn-primary" onClick={handleAddPricingPlan} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>+ Add Plan</button>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {(settingsForm.pricingPlans || []).map((plan, pIdx) => (
                      <div key={pIdx} style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                          <div className="upload-form__field">
                            <label className="input-label">Category</label>
                            <select className="select" value={plan.category || "wedding"} onChange={e => handleUpdatePricingPlan(pIdx, "category", e.target.value)}>
                              <option value="wedding">Wedding</option>
                              <option value="baby">Baby Photography</option>
                              <option value="model">Model Shoot</option>
                              <option value="general">General</option>
                            </select>
                          </div>
                          <div className="upload-form__field">
                            <label className="input-label">Plan Name</label>
                            <input className="input" placeholder="e.g. Gold Package" value={plan.name} onChange={e => handleUpdatePricingPlan(pIdx, "name", e.target.value)} />
                          </div>
                          <div className="upload-form__field">
                            <label className="input-label">Price</label>
                            <input className="input" placeholder="e.g. $1500" value={plan.price} onChange={e => handleUpdatePricingPlan(pIdx, "price", e.target.value)} />
                          </div>
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", cursor: "pointer" }}>
                            <input type="checkbox" checked={plan.popular} onChange={e => handleUpdatePricingPlan(pIdx, "popular", e.target.checked)} />
                            Mark as Popular / Best Value
                          </label>
                        </div>
                        
                        <div>
                          <label className="input-label">Features Included</label>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {plan.features.map((feat, fIdx) => (
                              <div key={fIdx} style={{ display: "flex", gap: "0.5rem" }}>
                                <input className="input" placeholder="e.g. 8 hours coverage" value={feat} onChange={e => handleUpdatePricingFeature(pIdx, fIdx, e.target.value)} />
                                <button className="btn-danger" onClick={() => handleRemovePricingFeature(pIdx, fIdx)}>✕</button>
                              </div>
                            ))}
                            <button className="btn-outline" onClick={() => handleAddPricingFeature(pIdx)} style={{ width: "fit-content", fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}>+ Add Feature</button>
                          </div>
                        </div>

                        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                          <button className="btn-danger" onClick={() => handleRemovePricingPlan(pIdx)}>Remove Plan</button>
                        </div>
                      </div>
                    ))}
                    {(settingsForm.pricingPlans || []).length === 0 && (
                      <div className="admin-empty">No pricing plans added. The public pricing page will be hidden.</div>
                    )}
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    <button className="btn-gold" onClick={handleSaveSettings}>Save Pricing Plans</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Testimonials ─────────────────────────────────────── */}
            {activeTab === "testimonials" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Testimonials</h1>
                </div>

                <div className="admin-card">
                  <h2 className="admin-section-title">Add Testimonial</h2>
                  <form onSubmit={handleAddTestimonial} className="testimonial-form">
                    <div className="upload-form__row">
                      <div className="upload-form__field">
                        <label className="input-label">Client Name</label>
                        <input className="input" placeholder="Name" value={testimonialForm.clientName}
                          onChange={e => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })} required />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">Event Type</label>
                        <input className="input" placeholder="Wedding, Baby Shoot..." value={testimonialForm.eventType}
                          onChange={e => setTestimonialForm({ ...testimonialForm, eventType: e.target.value })} />
                      </div>
                      <div className="upload-form__field" style={{ maxWidth: "120px" }}>
                        <label className="input-label">Rating (1-5)</label>
                        <input className="input" type="number" min="1" max="5" value={testimonialForm.rating}
                          onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} required />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Message</label>
                      <textarea className="input" rows="3" placeholder="Client's testimonial..."
                        value={testimonialForm.message}
                        onChange={e => setTestimonialForm({ ...testimonialForm, message: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-gold">Add Testimonial</button>
                  </form>
                </div>

                <h2 className="admin-section-title" style={{ marginTop: "2rem" }}>All Testimonials</h2>
                <div className="testimonials-list">
                  {testimonials.map(t => (
                    <div key={t._id} className="admin-card testimonial-row">
                      <div className="testimonial-row__header">
                        <div>
                          <div className="testimonial-row__name">{t.clientName}</div>
                          {t.eventType && <div className="testimonial-row__event">{t.eventType}</div>}
                        </div>
                        <div className="testimonial-row__stars">
                          {"★".repeat(t.rating || 5)}
                        </div>
                        <button className="btn btn-danger" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => handleDeleteTestimonial(t._id)}>Delete</button>
                      </div>
                      <p className="testimonial-row__msg">"{t.message}"</p>
                    </div>
                  ))}
                  {testimonials.length === 0 && <div className="admin-empty">No testimonials yet.</div>}
                </div>
              </div>
            )}

            {/* ── Settings ─────────────────────────────────────────── */}
            {activeTab === "settings" && (
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h1 className="admin-panel__title">Studio Settings</h1>
                </div>
                <div className="admin-card">
                  <form onSubmit={handleSaveSettings} className="settings-form">
                    <h3 className="admin-section-title">General</h3>
                    <div className="upload-form__row">
                      <div className="upload-form__field">
                        <label className="input-label">Studio Name</label>
                        <input className="input" value={settingsForm.studioName || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, studioName: e.target.value })} />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">Tagline</label>
                        <input className="input" value={settingsForm.tagline || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })} />
                      </div>
                    </div>
                    <div className="upload-form__row" style={{ marginTop: "1rem" }}>
                      <div className="upload-form__field">
                        <label className="input-label">Custom Logo Image (Optional)</label>
                        {settingsForm.logoImage ? (
                          <div style={{ position: "relative", width: "fit-content", background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "8px", marginBottom: "0.5rem" }}>
                            <img src={settingsForm.logoImage} alt="Logo Preview" style={{ maxHeight: "60px", objectFit: "contain" }} />
                            <button type="button" onClick={handleRemoveLogo} className="btn-danger" style={{ position: "absolute", top: -8, right: -8, borderRadius: "50%", padding: "4px 8px", fontSize: "12px" }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                            No custom logo set. Default text will be used.
                          </div>
                        )}
                        <label className="btn-outline" style={{ display: "inline-block", cursor: "pointer", padding: "0.4rem 1rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
                          Upload Logo
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleCropFileChange(e, { type: 'logo' })} />
                        </label>
                        
                        {settingsForm.logoImage && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <div style={{ display: "flex", gap: "1rem" }}>
                              <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ fontSize: "0.75rem" }}>Logo Shape</label>
                                <select className="input" style={{ padding: "0.4rem" }} value={settingsForm.logoShape || "rectangle"} onChange={e => setSettingsForm({ ...settingsForm, logoShape: e.target.value })}>
                                  <option value="rectangle">Rectangle (Original)</option>
                                  <option value="round">Round (Circle)</option>
                                </select>
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ fontSize: "0.75rem" }}>Logo Display</label>
                                <select className="input" style={{ padding: "0.4rem" }} value={settingsForm.logoDisplay || "logo-only"} onChange={e => setSettingsForm({ ...settingsForm, logoDisplay: e.target.value })}>
                                  <option value="logo-only">Logo Only</option>
                                  <option value="logo-and-text">Logo + Text</option>
                                </select>
                              </div>
                            </div>
                            
                            {settingsForm.logoDisplay === "logo-and-text" && (
                              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <label className="input-label" style={{ fontSize: "0.85rem", textAlign: "center", display: "block", marginBottom: "1.5rem" }}>
                                  Interactive Preview: Drag and drop the logo to position it relative to the text
                                </label>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                  <div style={{ 
                                    display: "grid", 
                                    gridTemplateColumns: "100px auto 100px", 
                                    gridTemplateRows: "80px auto 80px", 
                                    gap: "15px",
                                    alignItems: "center",
                                    justifyItems: "center"
                                  }}>
                                    {/* Top Dropzone */}
                                    <div
                                      onDragOver={e => e.preventDefault()}
                                      onDrop={e => setSettingsForm({ ...settingsForm, logoPlacement: "top" })}
                                      style={{ gridColumn: 2, gridRow: 1, width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: settingsForm.logoPlacement === "top" ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                                    >
                                      {settingsForm.logoPlacement === "top" && (
                                        <img draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'logo')} src={settingsForm.logoImage} alt="Logo" style={{ height: "45px", width: settingsForm.logoShape === "round" ? "45px" : "auto", borderRadius: settingsForm.logoShape === "round" ? "50%" : "0", objectFit: settingsForm.logoShape === "round" ? "cover" : "contain", cursor: "grab" }} />
                                      )}
                                    </div>

                                    {/* Left Dropzone */}
                                    <div
                                      onDragOver={e => e.preventDefault()}
                                      onDrop={e => setSettingsForm({ ...settingsForm, logoPlacement: "left" })}
                                      style={{ gridColumn: 1, gridRow: 2, width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (settingsForm.logoPlacement === "left" || !settingsForm.logoPlacement) ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                                    >
                                      {(settingsForm.logoPlacement === "left" || !settingsForm.logoPlacement) && (
                                        <img draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'logo')} src={settingsForm.logoImage} alt="Logo" style={{ height: "45px", width: settingsForm.logoShape === "round" ? "45px" : "auto", borderRadius: settingsForm.logoShape === "round" ? "50%" : "0", objectFit: settingsForm.logoShape === "round" ? "cover" : "contain", cursor: "grab" }} />
                                      )}
                                    </div>

                                    {/* Center Text */}
                                    <div style={{ gridColumn: 2, gridRow: 2, textAlign: "center", padding: "0 1rem" }}>
                                      <div style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "1px", color: "#fff", fontFamily: "var(--font-heading)" }}>{settingsForm.studioName || "DEVI STUDIO"}</div>
                                    </div>

                                    {/* Right Dropzone */}
                                    <div
                                      onDragOver={e => e.preventDefault()}
                                      onDrop={e => setSettingsForm({ ...settingsForm, logoPlacement: "right" })}
                                      style={{ gridColumn: 3, gridRow: 2, width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: settingsForm.logoPlacement === "right" ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                                    >
                                      {settingsForm.logoPlacement === "right" && (
                                        <img draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'logo')} src={settingsForm.logoImage} alt="Logo" style={{ height: "45px", width: settingsForm.logoShape === "round" ? "45px" : "auto", borderRadius: settingsForm.logoShape === "round" ? "50%" : "0", objectFit: settingsForm.logoShape === "round" ? "cover" : "contain", cursor: "grab" }} />
                                      )}
                                    </div>

                                    {/* Bottom Dropzone */}
                                    <div
                                      onDragOver={e => e.preventDefault()}
                                      onDrop={e => setSettingsForm({ ...settingsForm, logoPlacement: "bottom" })}
                                      style={{ gridColumn: 2, gridRow: 3, width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: settingsForm.logoPlacement === "bottom" ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                                    >
                                      {settingsForm.logoPlacement === "bottom" && (
                                        <img draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'logo')} src={settingsForm.logoImage} alt="Logo" style={{ height: "45px", width: settingsForm.logoShape === "round" ? "45px" : "auto", borderRadius: settingsForm.logoShape === "round" ? "50%" : "0", objectFit: settingsForm.logoShape === "round" ? "cover" : "contain", cursor: "grab" }} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: "1.5rem" }}>
                      <label className="input-label">About Text</label>
                      <textarea className="input" rows="4" value={settingsForm.aboutText || ""}
                        onChange={e => setSettingsForm({ ...settingsForm, aboutText: e.target.value })} />
                    </div>

                    <h3 className="admin-section-title" style={{ marginTop: "1.5rem" }}>Contact</h3>
                    <div className="upload-form__row">
                      <div className="upload-form__field">
                        <label className="input-label">Email</label>
                        <input className="input" type="email" value={settingsForm.contactEmail || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })} />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">Phone</label>
                        <input className="input" value={settingsForm.contactPhone || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Address</label>
                      <input className="input" value={settingsForm.contactAddress || ""}
                        onChange={e => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })} />
                    </div>

                    <h3 className="admin-section-title" style={{ marginTop: "1.5rem" }}>Social Links</h3>
                    <div className="upload-form__row">
                      <div className="upload-form__field">
                        <label className="input-label">Instagram URL</label>
                        <input className="input" value={settingsForm["socialLinks.instagram"] || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, "socialLinks.instagram": e.target.value })} />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">Facebook URL</label>
                        <input className="input" value={settingsForm["socialLinks.facebook"] || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, "socialLinks.facebook": e.target.value })} />
                      </div>
                      <div className="upload-form__field">
                        <label className="input-label">WhatsApp Number</label>
                        <input className="input" value={settingsForm["socialLinks.whatsapp"] || ""}
                          onChange={e => setSettingsForm({ ...settingsForm, "socialLinks.whatsapp": e.target.value })} />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                      Save Settings
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
        {/* Global Crop Modal */}
        {cropModalOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 1000, 
            background: "rgba(0,0,0,0.9)", display: "flex", 
            flexDirection: "column", padding: "2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="title-section" style={{ fontSize: "1.5rem" }}>Adjust Image</h2>
              <button className="btn-ghost" onClick={() => setCropModalOpen(false)}>✕ Close</button>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Drag to reposition. The highlighted area is exactly what will appear on the site.
            </p>
            
            <div style={{ position: "relative", flex: 1, background: "#121214", borderRadius: "12px", overflow: "hidden" }}>
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget?.aspect}
                onCropChange={setCrop}
                onCropComplete={(pct, px) => setCroppedAreaPixels(px)}
                onZoomChange={setZoom}
              />
            </div>
            
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, maxWidth: "300px" }}>
                <label>Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <button 
                className="btn-gold" 
                onClick={handleUploadCroppedImage}
                disabled={heroUploading}
              >
                {heroUploading ? "Publishing..." : "Publish Cropped Image"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AdminIcon({ name }) {
  const icons = {
    monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    message: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
}
