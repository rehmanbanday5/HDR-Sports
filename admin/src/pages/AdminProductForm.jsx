import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../api/client';

const emptyVariant = () => ({ key: crypto.randomUUID(), attrs: [{ k: '', v: '' }], sku: '', price: '', salePrice: '', stock: '' });
const emptySpec = () => ({ key: crypto.randomUUID(), k: '', v: '' });

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', subCategory: '', description: '', shortDescription: '',
    basePrice: '', baseSalePrice: '', hasVariants: false, sku: '', stock: '',
    tags: '', isFeatured: false, isNewArrival: false, isBestSeller: false, isActive: true,
  });
  const [variants, setVariants] = useState([emptyVariant()]);
  const [specs, setSpecs] = useState([emptySpec()]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    api.get('/categories', { params: { includeInactive: true } }).then((r) => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/admin/all`, { params: { search: '', limit: 1000 } }).then(({ data }) => {
      const product = data.products.find((p) => p._id === id);
      if (!product) return;
      setForm({
        name: product.name,
        category: product.category?._id || '',
        subCategory: product.subCategory || '',
        description: product.description,
        shortDescription: product.shortDescription || '',
        basePrice: product.basePrice,
        baseSalePrice: product.baseSalePrice || '',
        hasVariants: product.hasVariants,
        sku: product.sku || '',
        stock: product.stock || '',
        tags: (product.tags || []).join(', '),
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        isActive: product.isActive,
      });
      if (product.variants?.length) {
        setVariants(product.variants.map((v) => ({
          key: v._id,
          attrs: Object.entries(v.attributes || {}).map(([k, val]) => ({ k, v: val })),
          sku: v.sku, price: v.price, salePrice: v.salePrice || '', stock: v.stock,
        })));
      }
      if (product.specifications && Object.keys(product.specifications).length) {
        setSpecs(Object.entries(product.specifications).map(([k, v]) => ({ key: crypto.randomUUID(), k, v })));
      }
      setExistingImages(product.images || []);
      setLoaded(true);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- Variant helpers ---
  const updateVariant = (idx, field, value) => setVariants((vs) => vs.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  const updateVariantAttr = (idx, attrIdx, field, value) =>
    setVariants((vs) => vs.map((v, i) => (i !== idx ? v : { ...v, attrs: v.attrs.map((a, ai) => (ai === attrIdx ? { ...a, [field]: value } : a)) })));
  const addVariantAttr = (idx) => setVariants((vs) => vs.map((v, i) => (i === idx ? { ...v, attrs: [...v.attrs, { k: '', v: '' }] } : v)));
  const removeVariantAttr = (idx, attrIdx) => setVariants((vs) => vs.map((v, i) => (i !== idx ? v : { ...v, attrs: v.attrs.filter((_, ai) => ai !== attrIdx) })));
  const addVariant = () => setVariants((vs) => [...vs, emptyVariant()]);
  const removeVariant = (idx) => setVariants((vs) => vs.filter((_, i) => i !== idx));

  // --- Spec helpers ---
  const updateSpec = (idx, field, value) => setSpecs((s) => s.map((sp, i) => (i === idx ? { ...sp, [field]: value } : sp)));
  const addSpec = () => setSpecs((s) => [...s, emptySpec()]);
  const removeSpec = (idx) => setSpecs((s) => s.filter((_, i) => i !== idx));

  const removeExistingImage = async (productId, imageId) => {
    if (!isEdit) return;
    try {
      await api.delete(`/products/${productId}/images/${imageId}`);
      setExistingImages((imgs) => imgs.filter((i) => i._id !== imageId));
      toast.success('Image removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (form.hasVariants) {
        const variantPayload = variants
          .filter((v) => v.sku && v.price)
          .map((v) => ({
            attributes: Object.fromEntries(v.attrs.filter((a) => a.k).map((a) => [a.k, a.v])),
            sku: v.sku,
            price: Number(v.price),
            salePrice: v.salePrice ? Number(v.salePrice) : null,
            stock: Number(v.stock) || 0,
          }));
        fd.set('variants', JSON.stringify(variantPayload));
      }

      const specPayload = Object.fromEntries(specs.filter((s) => s.k).map((s) => [s.k, s.v]));
      fd.set('specifications', JSON.stringify(specPayload));

      newImages.forEach((file) => fd.append('images', file));

      if (isEdit) {
        await api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="text-sm text-pitch font-semibold hover:underline mb-4 inline-block">← Back to products</Link>
      <h1 className="font-display text-3xl font-bold mb-8">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border border-ink/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Basic Information</h2>
          <input required name="name" value={form.name} onChange={handleChange} placeholder="Product name" className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          <div className="grid sm:grid-cols-2 gap-4">
            <select required name="category" value={form.category} onChange={handleChange} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm bg-white">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="Sub-category (optional)" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          </div>
          <textarea required name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Full description" className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} placeholder="Short description (shown on product page)" className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags, comma separated" className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </section>

        <section className="bg-white border border-ink/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Pricing &amp; Stock</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="hasVariants" checked={form.hasVariants} onChange={handleChange} />
            This product has variants (size, weight, color, etc.)
          </label>

          {!form.hasVariants ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <input required type="number" name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="Price (PKR)" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input type="number" name="baseSalePrice" value={form.baseSalePrice} onChange={handleChange} placeholder="Sale price (optional)" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock quantity" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-3" />
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div key={v.key} className="border border-ink/15 rounded-sm p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-mono uppercase tracking-widest text-ink-soft">Variant {idx + 1}</p>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} className="text-ink-soft hover:text-leather"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {v.attrs.map((a, ai) => (
                      <div key={ai} className="flex gap-2">
                        <input value={a.k} onChange={(e) => updateVariantAttr(idx, ai, 'k', e.target.value)} placeholder="Attribute (e.g. Size)" className="flex-1 border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                        <input value={a.v} onChange={(e) => updateVariantAttr(idx, ai, 'v', e.target.value)} placeholder="Value (e.g. Large)" className="flex-1 border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                        {v.attrs.length > 1 && (
                          <button type="button" onClick={() => removeVariantAttr(idx, ai)} className="text-ink-soft hover:text-leather px-1"><X size={14} /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addVariantAttr(idx)} className="text-xs font-semibold text-pitch hover:underline">+ Add attribute</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input required value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} placeholder="SKU" className="border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                    <input required type="number" value={v.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} placeholder="Price" className="border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                    <input type="number" value={v.salePrice} onChange={(e) => updateVariant(idx, 'salePrice', e.target.value)} placeholder="Sale price" className="border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', e.target.value)} placeholder="Stock" className="border border-ink/20 rounded-sm px-3 py-2 text-sm" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="text-sm font-semibold text-pitch flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add another variant
              </button>
            </div>
          )}
        </section>

        <section className="bg-white border border-ink/10 rounded-sm p-6 space-y-3">
          <h2 className="font-display font-semibold text-lg">Specifications</h2>
          {specs.map((s, idx) => (
            <div key={s.key} className="flex gap-2">
              <input value={s.k} onChange={(e) => updateSpec(idx, 'k', e.target.value)} placeholder="Spec name (e.g. Willow Grade)" className="flex-1 border border-ink/20 rounded-sm px-3 py-2 text-sm" />
              <input value={s.v} onChange={(e) => updateSpec(idx, 'v', e.target.value)} placeholder="Value" className="flex-1 border border-ink/20 rounded-sm px-3 py-2 text-sm" />
              {specs.length > 1 && (
                <button type="button" onClick={() => removeSpec(idx)} className="text-ink-soft hover:text-leather px-1"><X size={14} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSpec} className="text-xs font-semibold text-pitch hover:underline">+ Add specification</button>
        </section>

        <section className="bg-white border border-ink/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Images</h2>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img._id} className="relative h-20 w-20">
                  <img src={img.url} alt="" className="h-full w-full object-cover rounded-sm border border-ink/10" />
                  <button type="button" onClick={() => removeExistingImage(id, img._id)} className="absolute -top-2 -right-2 bg-leather text-chalk rounded-full h-5 w-5 flex items-center justify-center">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input type="file" multiple accept="image/*" onChange={(e) => setNewImages(Array.from(e.target.files))} className="text-sm" />
          {newImages.length > 0 && <p className="text-xs text-ink-soft">{newImages.length} new file(s) selected — uploaded on save.</p>}
        </section>

        <section className="bg-white border border-ink/10 rounded-sm p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Visibility</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured product</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} /> New arrival</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} /> Best seller</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Visible on storefront</label>
          </div>
        </section>

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
