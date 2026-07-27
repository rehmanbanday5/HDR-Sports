import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Star } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyAddress = {
  label: 'Home',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'Pakistan',
  isDefault: false,
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/profile', { name, phone });
      setUser((u) => ({ ...u, ...data.user }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { data } = await api.post('/users/addresses', addressForm);
      setAddresses(data.addresses);
      setShowAddressForm(false);
      setAddressForm(emptyAddress);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await api.delete(`/users/addresses/${id}`);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-gully py-10 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">My Profile</h1>

      <section className="bg-white border border-ink/10 rounded-sm p-6 mb-8">
        <h2 className="font-display font-semibold text-lg mb-4">Account Details</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Email</label>
            <input disabled value={user?.email} className="w-full border border-ink/10 bg-chalk rounded-sm px-4 py-2.5 text-sm text-ink-soft" />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section className="bg-white border border-ink/10 rounded-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-semibold text-lg">Saved Addresses</h2>
          <button onClick={() => setShowAddressForm((s) => !s)} className="text-sm font-semibold text-pitch flex items-center gap-1 hover:underline">
            <Plus size={16} /> Add Address
          </button>
        </div>

        {addresses.length === 0 && !showAddressForm && (
          <p className="text-sm text-ink-soft">No saved addresses yet.</p>
        )}

        <div className="space-y-3 mb-4">
          {addresses.map((a) => (
            <div key={a._id} className="border border-ink/10 rounded-sm p-4 flex justify-between items-start">
              <div className="text-sm">
                <p className="font-semibold flex items-center gap-1.5">
                  {a.label} {a.isDefault && <Star size={12} className="fill-gold text-gold" />}
                </p>
                <p className="text-ink-soft mt-1">{a.fullName} · {a.phone}</p>
                <p className="text-ink-soft">{a.addressLine1}, {a.city}, {a.country}</p>
              </div>
              <button onClick={() => deleteAddress(a._id)} className="text-ink-soft hover:text-leather">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {showAddressForm && (
          <form onSubmit={addAddress} className="border-t border-ink/10 pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder="Label (e.g. Home)" value={addressForm.label} onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required placeholder="Full name" value={addressForm.fullName} onChange={(e) => setAddressForm((f) => ({ ...f, fullName: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required placeholder="Address line 1" value={addressForm.addressLine1} onChange={(e) => setAddressForm((f) => ({ ...f, addressLine1: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-2" />
              <input required placeholder="Postal code" value={addressForm.postalCode} onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            <button type="submit" disabled={savingAddress} className="btn-primary disabled:opacity-60">
              {savingAddress ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Profile;
