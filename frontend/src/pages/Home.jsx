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
import Banner1 from "../assets/Banner1.png";
import Banner2 from "../assets/Banner2.png";
import Banner3 from "../assets/Banner3.png";
import StoreLocation from "../assets/StoreLocation.jpeg";
import Middle from "../assets/Middle.png";
import topright from "../assets/topright.png";
import bottomleft from "../assets/bottomleft.png";
import bottomright from "../assets/bottomright.png";
import topleft from "../assets/topleft.png";
import { FaInstagram } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import ownerimage from "../assets/ownerimage.jpeg";
import "swiper/css";
import "swiper/css/effect-fade";

const HERO_BANNERS = [Banner1, Banner2, Banner3];
const MarqueeComponent = Marquee?.default ?? Marquee;

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-7">
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
  const [instagramPosts, setInstagramPosts] = useState([]);

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

  useEffect(() => {
    api
      .get("/instagram")
      .then((res) => {
        setInstagramPosts(res.data.posts || []);
      })
      .catch(() => {
        setInstagramPosts([]);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[560px] sm:min-h-[650px] lg:h-[85vh] overflow-hidden text-white">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="absolute inset-0 w-full h-full"
        >
          {HERO_BANNERS.map((banner, index) => (
            <SwiperSlide key={index}>
              <img
                src={banner}
                alt="HDR Sports Banner"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/10 to-black/65"></div>
        <div className="container-HDR relative z-10 h-full grid gap-8 items-center py-16 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-2xl text-center sm:text-left">
            <p className="eyebrow !text-[#D4AF37] mb-4">
              We’re shipping globally
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] mb-6">
              Premium cricket gear, crafted for elite performance.
            </h1>
            <p className="text-chalk/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Discover HDR Sports equipment designed for modern cricketers who
              demand quality, balance, and confidence. From bats to protective
              apparel, every product is built for performance and trusted
              worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:border-gold hover:text-gold"
              >
                Shop Collection <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-HDR py-14 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-10">
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

        <div className="grid gap-4 md:gap-6 lg:grid-cols-[1.25fr_2.7fr_1.25fr]">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {CATEGORY_TILES.side.slice(0, 2).map((item) => (
              <Link
                key={item.link}
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
            className="group relative overflow-hidden h-[320px] sm:h-[420px] lg:h-[570px]"
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

              <h2 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
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
                key={item.link}
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

      {/* Brand Story */}
      <section className="container-HDR py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-16 items-center">
          {/* Owner Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={ownerimage}
                alt="Founder of HDR Sports"
                className="w-full h-[320px] sm:h-[420px] lg:h-[560px] object-cover"
              />
            </div>
          </div>

          {/* Story */}
          <div className="max-w-3xl">
            <p className="eyebrow !text-[#D4AF37] mb-4">Our Story</p>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#080B12] leading-tight mb-8">
              Built For Cricketers.
              <br />
              Trusted By Players.
            </h2>

            <p className="text-base sm:text-lg text-[#555] leading-8 mb-6">
              HDR Sports was founded with one clear vision — to provide premium
              cricket equipment that players can trust. Every product reflects
              our commitment to quality craftsmanship, performance, and
              reliability.
            </p>

            <p className="text-base sm:text-lg text-[#555] leading-8 mb-10">
              From passionate beginners to professional athletes, we believe
              every cricketer deserves equipment that inspires confidence every
              time they step onto the field.
            </p>

            {/* Signature */}
            <div className="border-t border-black/10 pt-8">
              <h4 className="text-xl font-bold text-[#080B12]">Haider</h4>

              <p className="uppercase tracking-[0.25em] text-xs text-[#D4AF37] mt-1">
                Founder & CEO
              </p>
            </div>
          </div>
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
              className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoryProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Section>

      {/* Latest Arrivals */}

      <Section
        eyebrow="Fresh Additions"
        title="Latest Arrivals"
        viewAllHref="/shop?newArrival=true"
      >
        <div className="max-w-2xl mb-10">
          <p className="text-lg text-[#555] leading-relaxed mb-6">
            Discover our newest collection of premium cricket equipment,
            carefully selected for players who demand quality, performance, and
            confidence on every delivery.
          </p>
        </div>

        {newArrivals === null ? (
          <ProductGridSkeleton count={4} />
        ) : newArrivals.length === 0 ? (
          <p className="text-ink-soft text-sm">No new arrivals yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* Instagram Feed */}

      <div className="text-center mb-14">
        <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#080B12]">
          WORN BY THE BEST
        </h2>

        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto my-5"></div>

        <p className="text-lg font-medium tracking-[0.2em] uppercase text-gray-600">
          Our HDR Pro Players
        </p>
      </div>

      <section className="container-HDR py-12 sm:py-20">
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10 flex-wrap mb-10">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full border overflow-hidden bg-white flex items-center justify-center">
            <img
              src="/HDR.png"
              alt="HDR Sports"
              className="w-11 h-11 object-contain"
            />
          </div>

          {/* Username */}
          <h3 className="text-xl font-bold">@hdr.sports</h3>

          {/* Posts */}
          <div className="text-center">
            <div className="font-bold text-lg">584</div>
            <div className="text-xs text-gray-500 uppercase">Posts</div>
          </div>

          {/* Followers */}
          <div className="text-center">
            <div className="font-bold text-lg">16.5K</div>
            <div className="text-xs text-gray-500 uppercase">Followers</div>
          </div>

          {/* Follow Button */}
          <a
            href="https://instagram.com/hdrsports"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#080B12] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#222]"
          >
            <FaInstagram className="text-lg" />
            Follow
          </a>
        </div>

        {/* Instagram Grid */}
        <MarqueeComponent speed={45} pauseOnHover gradient={false}>
          {instagramPosts.map((post) => (
            <a
              key={post._id}
              href={post.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group mx-3 sm:mx-6 block"
            >
              <div
                className="
      relative
      w-[220px]
      h-[280px]
      sm:w-[270px]
      sm:h-[330px]
      rounded-[24px]
      overflow-hidden
      bg-white
      shadow-[0_15px_40px_rgba(0,0,0,0.18)]
      transition-all
      duration-500
      group-hover:-translate-y-3
      group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]
    "
              >
                {/* Image */}
                <img
                  src={post.image.url}
                  alt=""
                  className="
        w-full
        h-full
        object-cover
        transition-all
        duration-700
        group-hover:scale-110
      "
                />

                {/* Soft Image Overlay */}
                <div
                  className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/50
        via-transparent
        to-transparent
      "
                />

                {/* Glass Instagram Badge */}
                <div
                  className="
        absolute
        bottom-5
        left-5
        right-5
        flex
        items-center
        justify-between
        bg-white/20
        backdrop-blur-md
        border
        border-white/30
        rounded-full
        px-4
        py-2
        opacity-0
        translate-y-3
        group-hover:opacity-100
        group-hover:translate-y-0
        transition-all
        duration-500
      "
                >
                  <span className="text-white text-sm font-semibold">
                    HDR Sports
                  </span>

                  <div
                    className="
          w-9
          h-9
          rounded-full
          bg-white
          flex
          items-center
          justify-center
        "
                  >
                    <FaInstagram className="text-[#E1306C]" />
                  </div>
                </div>

                {/* Top Shine */}
                <div
                  className="
        absolute
        -top-1/2
        -left-1/2
        w-[200%]
        h-[200%]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        rotate-45
        translate-x-[-100%]
        group-hover:translate-x-[100%]
        transition-transform
        duration-1000
      "
                />
              </div>
            </a>
          ))}
        </MarqueeComponent>
      </section>

      {/* Our Promise */}
      <section className="bg-[#080B12] text-white">
        <div className="container-HDR py-14 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow !text-[#D4AF37] mb-3">Our Promise</p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Excellence In Every Delivery
            </h2>

            <p className="text-white/70 mt-4 leading-relaxed">
              At HDR Sports, we are committed to providing reliable cricket
              equipment, premium service, and products that help players perform
              with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Premium Materials</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Every product is carefully selected for quality, durability, and
                performance on the cricket field.
              </p>
            </div>

            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Player Tested Gear</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Equipment designed for beginners, club players, and
                professionals who demand dependable performance.
              </p>
            </div>

            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Global Standards</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                Delivering trusted cricket products with careful packaging and
                reliable service across Pakistan and worldwide.
              </p>
            </div>

            <div className="border border-white/10 rounded-[1.8rem] p-7 transition hover:border-[#D4AF37]">
              <h3 className="font-bold text-lg mb-2">Player First Approach</h3>

              <p className="text-white/60 text-sm leading-relaxed">
                We focus on helping every cricketer find the right gear to
                improve confidence and enjoy the game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="container-HDR pb-14 sm:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="eyebrow !text-[#D4AF37] mt-8">Visit Our Store</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#080B12] mt-8">
            Find HDR Sports On Map
          </h2>
          <p className="text-ink-soft mt-10 leading-relaxed">
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
              className="block w-full h-[280px] sm:h-[350px] lg:h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
