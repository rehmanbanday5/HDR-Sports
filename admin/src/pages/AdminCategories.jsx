import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from "../api/client";

const emptyForm = { name: '', description: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    api.get('/categories', { params: { includeInactive: true } }).then((r) => setCategories(r.data.categories)).catch(() => setCategories([]));
  };

  useEffect(() => { fetchCategories(); }, []);

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowForm(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/categories/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      setShowForm(false);
      setImageFile(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md text-sm font-semibold border border-black hover:bg-gold hover:text-[#D4AF37] transition-all duration-200 shadow-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-sm p-6 mb-6 space-y-4 max-w-md"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-display font-semibold">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Category name"
            className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Description"
            rows={2}
            className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="bg-white border border-ink/10 rounded-sm divide-y divide-ink/10">
        {categories === null && (
          <div className="p-6">
            <div className="skeleton h-8 w-full" />
          </div>
        )}
        {categories?.length === 0 && (
          <p className="p-6 text-ink-soft text-sm">No categories yet.</p>
        )}
        {categories?.map((c) => (
          <div key={c._id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {c.image?.url && (
                <img
                  src={c.image.url}
                  alt=""
                  className="h-10 w-10 rounded-sm object-cover border border-ink/10"
                />
              )}
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-ink-soft">{c.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => startEdit(c)}
                className="text-ink-soft hover:text-pitch"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(c._id, c.name)}
                className="text-ink-soft hover:text-leather"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
