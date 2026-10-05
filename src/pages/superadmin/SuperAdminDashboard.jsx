import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin as loginApi, getStats, getAllTenants, createTenant, updateTenant, deleteTenant, resetAdminPassword } from "../../api/superAdminApi";
import { useSuperAuth } from "../../context/AuthContext";
import "./SuperAdmin.css";

export default function SuperAdminDashboard() {
  const { superAdminInfo, loginSuperAdmin, logoutSuperAdmin, isAuthenticated } = useSuperAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("tenants");
  const [toast, setToast] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [createForm, setCreateForm] = useState({
    name: "", slug: "", plan: "with_admin", contactEmail: "",
    adminUsername: "", adminPassword: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, tenantsRes] = await Promise.all([getStats(), getAllTenants()]);
      setStats(statsRes.data.data);
      setTenants(tenantsRes.data.data || []);
    } catch { showToast("Failed to load data", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await loginApi(loginForm);
      loginSuperAdmin(res.data.token, res.data.admin);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    try {
      await createTenant(createForm);
      showToast("Tenant created successfully!");
      setShowCreate(false);
      setCreateForm({ name: "", slug: "", plan: "with_admin", contactEmail: "", adminUsername: "", adminPassword: "" });
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Create failed", "error");
    }
  };

  const handleToggleActive = async (t) => {
    try {
      await updateTenant(t._id, { active: !t.active });
      showToast(`Tenant ${!t.active ? "activated" : "deactivated"}`);
      loadData();
    } catch { showToast("Update failed", "error"); }
  };

  const handleDeleteTenant = async (id, name) => {
    if (!confirm(`Delete tenant "${name}"? This removes their registry entry.`)) return;
    try {
      await deleteTenant(id);
      showToast("Tenant deleted");
      loadData();
    } catch { showToast("Delete failed", "error"); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetAdminPassword(resetTarget._id, { newPassword });
      showToast("Password reset successfully!");
      setResetTarget(null);
      setNewPassword("");
    } catch { showToast("Reset failed", "error"); }
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="sa-login">
        <div className="sa-login__bg">
          <div className="sa-login__grid" />
          <div className="sa-login__glow" />
        </div>
        <div className="sa-login__card">
          <div className="sa-login__header">
            <div className="sa-login__icon">⚡</div>
            <h1>Super Admin</h1>
            <p>Platform management portal</p>
          </div>
          {loginError && <div className="admin-login__error">✕ {loginError}</div>}
          <form onSubmit={handleLogin} className="admin-login__form">
            <div>
              <label className="input-label">Username</label>
              <input className="input" type="text" value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input" type="password" value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-gold admin-login__submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="sa-dash">
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sa-header">
        <div className="sa-header__left">
          <div className="sa-header__icon">⚡</div>
          <div>
            <div className="sa-header__title">Super Admin</div>
            <div className="sa-header__sub">Platform Management</div>
          </div>
        </div>
        <div className="sa-header__right">
          <span className="sa-header__user">{superAdminInfo?.username}</span>
          <button className="btn btn-outline" onClick={logoutSuperAdmin} style={{ fontSize: "0.8rem" }}>
            Logout
          </button>
        </div>
      </header>

      <div className="sa-content">
        {/* Stats */}
        {stats && (
          <div className="sa-stats">
            {[
              { label: "Total Tenants", val: stats.totalTenants },
              { label: "Active", val: stats.activeTenants },
              { label: "With Admin", val: stats.withAdmin },
              { label: "Without Admin", val: stats.withoutAdmin },
              { label: "Total Storage", val: stats.totalStorageUsed },
            ].map(s => (
              <div key={s.label} className="sa-stat">
                <div className="sa-stat__val">{s.val}</div>
                <div className="sa-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tenants Table */}
        <div className="sa-section">
          <div className="sa-section__header">
            <h2 className="sa-section__title">Tenants ({tenants.length})</h2>
            <button className="btn btn-gold" style={{ fontSize: "0.85rem" }} onClick={() => setShowCreate(true)}>
              + Create Tenant
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>Loading...</div>
          ) : (
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Studio Name</th>
                    <th>Slug</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Storage</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t._id}>
                      <td className="sa-table__name">{t.name}</td>
                      <td><code className="sa-table__slug">{t.slug}</code></td>
                      <td>
                        <span className={`badge ${t.plan === "with_admin" ? "badge-gold" : "badge-success"}`}>
                          {t.plan === "with_admin" ? "Admin" : "Static"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${t.active ? "badge-success" : "badge-error"}`}>
                          {t.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="sa-table__storage">
                        {t.storageUsed ? `${(t.storageUsed / 1048576).toFixed(1)} MB` : "0 MB"}
                        {" / "}
                        {t.storageLimit ? `${(t.storageLimit / 1073741824).toFixed(0)} GB` : "1 GB"}
                      </td>
                      <td className="sa-table__date">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="sa-table__actions">
                          <button className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                            onClick={() => handleToggleActive(t)}>
                            {t.active ? "Deactivate" : "Activate"}
                          </button>
                          {t.plan === "with_admin" && (
                            <button className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                              onClick={() => setResetTarget(t)}>
                              Reset PW
                            </button>
                          )}
                          <button className="btn btn-danger" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                            onClick={() => handleDeleteTenant(t._id, t.name)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>No tenants yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Tenant Modal */}
      {showCreate && (
        <div className="sa-modal" onClick={() => setShowCreate(false)}>
          <div className="sa-modal__box" onClick={e => e.stopPropagation()}>
            <h2 className="sa-modal__title">Create New Tenant</h2>
            <form onSubmit={handleCreateTenant} className="sa-modal__form">
              <div className="upload-form__row">
                <div className="upload-form__field">
                  <label className="input-label">Studio Name</label>
                  <input className="input" placeholder="e.g. Royal Studio" value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })} required />
                </div>
                <div className="upload-form__field">
                  <label className="input-label">Slug (URL)</label>
                  <input className="input" placeholder="e.g. royal-studio" value={createForm.slug}
                    onChange={e => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required />
                </div>
              </div>
              <div className="upload-form__row">
                <div className="upload-form__field">
                  <label className="input-label">Plan</label>
                  <select className="select" value={createForm.plan}
                    onChange={e => setCreateForm({ ...createForm, plan: e.target.value })}>
                    <option value="with_admin">With Admin (Backend)</option>
                    <option value="without_admin">Without Admin (Static)</option>
                  </select>
                </div>
                <div className="upload-form__field">
                  <label className="input-label">Contact Email</label>
                  <input className="input" type="email" value={createForm.contactEmail}
                    onChange={e => setCreateForm({ ...createForm, contactEmail: e.target.value })} />
                </div>
              </div>
              {createForm.plan === "with_admin" && (
                <div className="upload-form__row">
                  <div className="upload-form__field">
                    <label className="input-label">Admin Username</label>
                    <input className="input" placeholder="Admin username" value={createForm.adminUsername}
                      onChange={e => setCreateForm({ ...createForm, adminUsername: e.target.value })} />
                  </div>
                  <div className="upload-form__field">
                    <label className="input-label">Admin Password</label>
                    <input className="input" type="password" placeholder="Admin password" value={createForm.adminPassword}
                      onChange={e => setCreateForm({ ...createForm, adminPassword: e.target.value })} />
                  </div>
                </div>
              )}
              <div className="sa-modal__actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Create Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="sa-modal" onClick={() => setResetTarget(null)}>
          <div className="sa-modal__box" onClick={e => e.stopPropagation()}>
            <h2 className="sa-modal__title">Reset Admin Password</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Resetting password for <strong style={{ color: "var(--white)" }}>{resetTarget.name}</strong>
            </p>
            <form onSubmit={handleResetPassword} className="sa-modal__form">
              <div>
                <label className="input-label">New Password</label>
                <input className="input" type="password" placeholder="Enter new password"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength="6" />
              </div>
              <div className="sa-modal__actions">
                <button type="button" className="btn btn-ghost" onClick={() => setResetTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
