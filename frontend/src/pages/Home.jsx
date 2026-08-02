import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Globe2 } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { slugify } from '../utils/format';
import Banner1 from "../assets/Banner1.png";
import Banner2 from "../assets/Banner2.png";
import Banner3 from "../assets/Banner3.png";
import StoreLocation from "../assets/StoreLocation.jpeg"

const HERO_BANNERS = [Banner1, Banner2, Banner3];

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

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
  <section className="container-HDR py-14">
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
      <section className="relative h-[85vh] min-h-[650px] overflow-hidden text-white">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          speed={700}
          className="absolute inset-0 h-full w-full"
        >
          {HERO_BANNERS.map((banner, index) => (
            <SwiperSlide key={index}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 z-[1]"></div>
        <div className="container-HDR relative z-10 h-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-lg">
            <p className="eyebrow !text-[#D4AF37] mb-4">
              We're Shipping Globally
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Producer Of All Quality Cricket Gears
            </h1>
            <p className="text-chalk/75 text-lg leading-relaxed mb-8 max-w-lg">
              From premium cricket bats to professional protective gear, we
              create quality cricket essentials built for every player — from
              street cricket enthusiasts to professionals. Proudly made in
              Pakistan and delivered worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2  text-white px-7 py-3 rounded-xl font-bold border border-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37]"
              >
                Shop All Gear <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="border-b border-ink/10">
        <div className="container-HDR grid grid-cols-2 lg:grid-cols-4 gap-6 py-10">
          {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={22} className="text-pitch shrink-0 mt-1" />

              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight">{title}</p>

                <p className="text-xs text-ink-soft mt-1 leading-relaxed max-w-[180px]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <Section
        eyebrow="Our Picks"
        title="Featured Products"
        viewAllHref="/shop?featured=true"
      >
        {featured === null ? (
          <ProductGridSkeleton />
        ) : featured.length === 0 ? (
          <p className="text-ink-soft text-sm">
            No featured products yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* Best Sellers */}
      <Section
        eyebrow="Fan favourites"
        title="Best Sellers"
        viewAllHref="/shop?bestSeller=true"
      >
        {bestSellers === null ? (
          <ProductGridSkeleton count={4} />
        ) : bestSellers.length === 0 ? (
          <p className="text-ink-soft text-sm">No best sellers yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* Why Choose HDR Sports */}
      <section className="bg-[#080B12] text-white mb-20">
        <div className="container-HDR py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow !text-[#D4AF37] mb-3">Why Choose Us</p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Why Choose HDR Sports?
            </h2>

            <p className="text-white/70 mt-4 leading-relaxed">
              We provide premium quality cricket equipment built for players who
              demand performance, reliability, and confidence on every pitch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition">
              <h3 className="font-bold text-lg mb-2">Premium Quality Gear</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Carefully selected cricket equipment designed for beginners,
                club players, and professionals.
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition">
              <h3 className="font-bold text-lg mb-2">
                Authentic Cricket Products
              </h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Genuine bats, protective gear, and accessories trusted by
                cricket enthusiasts.
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition">
              <h3 className="font-bold text-lg mb-2">Global Delivery</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Delivering premium cricket gear across Pakistan and around the
                world with safe and reliable shipping.
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition">
              <h3 className="font-bold text-lg mb-2">Player First Approach</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Gear selected to help every player perform better and enjoy the
                game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="container-HDR pb-20">
        {/* Heading Above Image */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="eyebrow !text-[#D4AF37] mb-3">Visit Our Store</p>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#080B12]">
            Find HDR Sports On Map
          </h2>

          <p className="text-ink-soft mt-4 leading-relaxed">
            Visit our store and explore premium cricket gear in person. Click
            below to open our exact location on Google Maps.
          </p>
        </div>

        {/* Image Card */}
        <div className="relative overflow-hidden rounded-xl group">
          <a
            href="https://www.google.com/maps/place/HDR+SPORTS/@33.6362121,73.0531171,17z/data=!3m1!4b1!4m6!3m5!1s0x38df956d2c5ef743:0xcea610325bf2d8dc!8m2!3d33.6362121!4d73.0531171!16s%2Fg%2F11srgjk2gl?entry=ttu&g_ep=EgoyMDI2MDcyOC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={StoreLocation}
              alt="HDR Sports Store Location"
              className="block w-full h-[350px] sm:h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
