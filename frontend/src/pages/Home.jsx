import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Globe2 } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { slugify } from '../utils/format';

const CATEGORY_TILES = [
  { name: 'Cricket Bats', img: 'https://placehold.co/600x750/1B4332/F7F5F0?text=Bats' },
  { name: 'Cricket Balls', img: 'https://placehold.co/600x750/A6303C/F7F5F0?text=Balls' },
  { name: 'Batting Gloves', img: 'https://placehold.co/600x750/C9A574/161616?text=Gloves' },
  { name: 'Helmets', img: 'https://placehold.co/600x750/161616/F7F5F0?text=Helmets' },
  { name: 'Cricket Bags', img: 'https://placehold.co/600x750/2D6A4F/F7F5F0?text=Bags' },
  { name: 'Clothing', img: 'https://placehold.co/600x750/D4A73D/161616?text=Apparel' },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Authentic Gear', desc: 'Every product sourced and quality-checked for match play.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Fast dispatch across Pakistan, with express options.' },
  { icon: Globe2, title: 'Ships Internationally', desc: 'We pack and post cricket gear worldwide.' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day returns on unused items in original packaging.' },
];

const Section = ({ eyebrow, title, viewAllHref, children }) => (
  <section className="container-gully py-14">
    <div className="flex items-end justify-between mb-7">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-heading">{title}</h2>
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-pitch hover:gap-2 transition-all">
          View all <ArrowRight size={16} />
        </Link>
      )}
    </div>
    {children}
  </section>
);

const Home = () => {
  const [featured, setFeatured] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);
  const [bestSellers, setBestSellers] = useState(null);

  useEffect(() => {
    api.get('/products', { params: { featured: true, limit: 8 } }).then((r) => setFeatured(r.data.products)).catch(() => setFeatured([]));
    api.get('/products', { params: { newArrival: true, limit: 4 } }).then((r) => setNewArrivals(r.data.products)).catch(() => setNewArrivals([]));
    api.get('/products', { params: { bestSeller: true, limit: 4 } }).then((r) => setBestSellers(r.data.products)).catch(() => setBestSellers([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-pitch text-chalk overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="container-gully relative py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow !text-willow mb-4">Straight from the gully to the crease</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Gear that plays as hard as you do.
            </h1>
            <p className="text-chalk/75 text-lg leading-relaxed mb-8 max-w-lg">
              Premium bats, protective wear, and match essentials — engineered for players from street cricket
              to the professional circuit. Based in Pakistan, shipped worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-accent">
                Shop All Gear <ArrowRight size={18} />
              </Link>
              <Link to={`/shop?categorySlug=${slugify('Cricket Bats')}`} className="inline-flex items-center justify-center gap-2 border border-chalk/40 text-chalk font-semibold px-6 py-3 rounded-sm hover:bg-chalk/10 transition-colors">
                Explore Bats
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] bg-willow/20 border border-chalk/20 rounded-sm flex items-center justify-center">
              <img
                src="https://placehold.co/700x875/C9A574/161616?text=GULLY+CRICKET"
                alt="Cricket player with GULLY equipment"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="border-b border-ink/10">
        <div className="container-gully grid grid-cols-2 lg:grid-cols-4 gap-6 py-10">
          {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={22} className="text-pitch shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-ink-soft mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category tiles */}
      <section className="container-gully py-14">
        <p className="eyebrow mb-2">Shop by category</p>
        <h2 className="section-heading mb-7">Everything for match day</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_TILES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?categorySlug=${slugify(c.name)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm"
            >
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-chalk font-display font-semibold text-sm">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <Section eyebrow="Handpicked" title="Featured Products" viewAllHref="/shop?featured=true">
        {featured === null ? <ProductGridSkeleton /> : featured.length === 0 ? (
          <p className="text-ink-soft text-sm">No featured products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </Section>

      {/* New Arrivals */}
      <Section eyebrow="Just landed" title="New Arrivals" viewAllHref="/shop?newArrival=true">
        {newArrivals === null ? <ProductGridSkeleton count={4} /> : newArrivals.length === 0 ? (
          <p className="text-ink-soft text-sm">No new arrivals yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </Section>

      {/* Best Sellers */}
      <Section eyebrow="Fan favourites" title="Best Sellers" viewAllHref="/shop?bestSeller=true">
        {bestSellers === null ? <ProductGridSkeleton count={4} /> : bestSellers.length === 0 ? (
          <p className="text-ink-soft text-sm">No best sellers yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </Section>

      {/* Promo banner */}
      <section className="container-gully pb-20">
        <div className="bg-leather text-chalk rounded-sm px-8 py-12 sm:py-16 text-center">
          <p className="eyebrow !text-chalk/70 mb-3">Limited time</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Season Kit Sale — Up to 25% Off</h2>
          <p className="text-chalk/85 max-w-md mx-auto mb-7">
            Gear up for the new season with savings across bats, pads, and protective equipment.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-chalk text-ink font-semibold px-7 py-3 rounded-sm hover:bg-chalk/90 transition-colors">
            Shop the Sale <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
