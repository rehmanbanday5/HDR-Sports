import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Globe2,
} from "lucide-react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import { slugify } from "../utils/format";
import { useMemo } from "react";
import Banner1 from "../assets/Banner1.png";
import Banner2 from "../assets/Banner2.png";
import Banner3 from "../assets/Banner3.png";
import StoreLocation from "../assets/StoreLocation.jpeg";
import Middle from "../assets/Middle.png";
import topright from "../assets/topright.png";
import bottomleft from "../assets/bottomleft.png";
import bottomright from "../assets/bottomright.png";
import topleft from "../assets/topleft.png";

const HERO_BANNERS = [Banner1, Banner2, Banner3];

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const CATEGORY_TILES = {
  featured: {
    title: "English Willow Bats",
    subtitle: "Premium Match Collection",
    image: Middle,
    link: "/shop",
  },

  side: [
    {
      image: topright,
      link: "/shop?categorySlug=batting-gloves",
    },
    {
      image: bottomright,
      link: "/shop?categorySlug=batting-pads",
    },
    {
      image: topleft,
      link: "/shop?categorySlug=helmets",
    },
    {
      image: bottomleft,
      link: "/shop?categorySlug=cricket-bags",
    },
  ],
};

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Authentic Gear",
    desc: "Every product sourced and quality-checked for match play.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "Fast dispatch across Pakistan, with express options.",
  },
  {
    icon: Globe2,
    title: "Ships Internationally",
    desc: "We pack and post cricket gear worldwide.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day returns on unused items in original packaging.",
  },
];

const Section = ({ eyebrow, title, viewAllHref, children }) => (
  <section className="container-HDR py-14">
    <div className="flex items-end justify-between mb-7">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-heading">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-pitch hover:gap-2 transition-all"
        >
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

  const FEATURED_TABS = [
    { label: "Cricket Bats", slug: "cricket-bats" },
    { label: "Batting Gloves", slug: "batting-gloves" },
    { label: "Helmets", slug: "helmets" },
    { label: "Batting Pads", slug: "batting-pads" },
  ];

  const [activeTab, setActiveTab] = useState("cricket-bats");
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          categorySlug: activeTab,
          limit: 8,
        },
      })
      .then((res) => setCategoryProducts(res.data.products || []))
      .catch(() => setCategoryProducts([]));
  }, [activeTab]);

  useEffect(() => {
    api
      .get("/products", { params: { featured: true, limit: 8 } })
      .then((r) => setFeatured(r.data.products))
      .catch(() => setFeatured([]));
    api
      .get("/products", { params: { newArrival: true, limit: 4 } })
      .then((r) => setNewArrivals(r.data.products))
      .catch(() => setNewArrivals([]));
    api
      .get("/products", { params: { bestSeller: true, limit: 4 } })
      .then((r) => setBestSellers(r.data.products))
      .catch(() => setBestSellers([]));
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
            delay: 3500,
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

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/10 to-black/65"></div>
        <div className="container-HDR relative z-10 h-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <p className="eyebrow !text-[#D4AF37] mb-4">
              We’re shipping globally
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] mb-6">
              Premium cricket gear, crafted for elite performance.
            </h1>
            <p className="text-chalk/80 text-lg leading-relaxed mb-8 max-w-xl">
              Discover HDR Sports equipment designed for modern cricketers who
              demand quality, balance, and confidence. From bats to protective
              apparel, every product is built for performance and trusted
              worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:border-gold hover:text-gold"
              >
                Shop Collection <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-HDR py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow !text-[#D4AF37] mb-3">
              Most Popular Departments
            </p>

            <h2 className="section-heading">Explore Our Premium Collections</h2>
          </div>

          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#080B12] hover:text-[#D4AF37] transition"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.25fr_2.7fr_1.25fr] gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {CATEGORY_TILES.side.slice(0, 2).map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group relative overflow-hidden aspect-square w-full"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>

          {/* CENTER */}
          <Link
            to={CATEGORY_TILES.featured.link}
            className="group relative overflow-hidden h-[570px]"
          >
            <img
              src={CATEGORY_TILES.featured.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-10 left-10 max-w-sm">
              <p className="uppercase tracking-[0.35em] text-[#D4AF37] text-xs mb-4">
                Featured Collection
              </p>

              <h2 className="text-white text-4xl font-black leading-tight mb-4">
                {CATEGORY_TILES.featured.title}
              </h2>

              <p className="text-white/80 mb-6">
                {CATEGORY_TILES.featured.subtitle}
              </p>

              <span className="inline-flex items-center gap-2 bg-white text-[#080B12] px-6 py-3 font-semibold transition group-hover:bg-[#D4AF37]">
                Shop Now
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            {CATEGORY_TILES.side.slice(2, 4).map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group relative overflow-hidden aspect-square w-full"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="bg-[#fbf7f0] py-16">
        <div className="container-HDR grid gap-6 lg:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="premium-panel h-full">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-ink/95 text-gold shadow-lg shadow-black/10">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">{title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}

      <Section
        eyebrow="Our Picks"
        title="Cricket Collection"
        viewAllHref="/shop"
      >
        <div className="flex flex-wrap gap-3 mb-8">
          {FEATURED_TABS.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
          ${
            activeTab === tab.slug
              ? "bg-[#080B12] text-white"
              : "bg-[#F5F5F5] text-[#080B12] hover:bg-[#D4AF37] hover:text-black"
          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {categoryProducts.length === 0 ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoryProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Section>

      {/* New Arrivals */}
      <Section
        eyebrow="Fresh arrivals"
        title="New In"
        viewAllHref="/shop?newArrival=true"
      >
        {newArrivals === null ? (
          <ProductGridSkeleton count={4} />
        ) : newArrivals.length === 0 ? (
          <p className="text-ink-soft text-sm">No new arrivals yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p) => (
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

      {/* Brand Story */}
      <section className="container-HDR py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow !text-[#D4AF37] mb-4">Brand Story</p>
            <h2 className="section-heading">
              Crafted for players who expect more from their cricket gear.
            </h2>
            <p className="section-note mt-6">
              HDR Sports combines precision engineering and premium materials to
              create cricket equipment that performs under pressure. Our range
              is built for serious players and emerging talent who want quality,
              durability, and style.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-willow-dark mb-3">
                  Heritage
                </p>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Our gear is shaped by local craftsmanship and designed for
                  global players.
                </p>
              </div>
              <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-willow-dark mb-3">
                  Performance
                </p>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Every product is selected to support confidence, balance, and
                  consistency on the pitch.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-ink/10 bg-ink/5 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gold mb-3">
                Trusted choice
              </p>
              <p className="text-2xl font-semibold text-ink">
                Local athletes and international customers trust HDR Sports for
                dependable gear.
              </p>
            </div>
            <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-willow-dark mb-3">
                Quality promise
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                Quality checks at every stage ensure gear that meets the demands
                of modern cricket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HDR Sports */}
      <section className="bg-[#080B12] text-white">
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
            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Premium Quality Gear</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Carefully selected cricket equipment designed for beginners,
                club players, and professionals.
              </p>
            </div>
            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">
                Authentic Cricket Products
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Genuine bats, protective gear, and accessories trusted by
                cricket enthusiasts.
              </p>
            </div>
            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Global Delivery</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Delivering premium cricket gear across Pakistan and around the
                world with safe and reliable shipping.
              </p>
            </div>
            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Player First Approach</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Gear selected to help every player perform better and enjoy the
                game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="container-HDR py-16">
        <div className="rounded-[2rem] border border-ink/10 bg-[#0d1117] px-8 py-12 text-white shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow !text-[#D4AF37] mb-3">Join the team</p>
              <h2 className="text-3xl font-semibold">
                Discover premium cricket gear and join the HDR community.
              </h2>
            </div>
            <Link to="/shop" className="btn-primary">
              Shop HDR Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="container-HDR pb-20">
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

        <div className="relative overflow-hidden rounded-[2rem] group">
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
