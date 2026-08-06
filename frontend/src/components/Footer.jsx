import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaWhatsapp,
  FaLocationDot,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-[#080b13] text-white">
      <div className="container-HDR py-16">
        <div className="grid gap-12 xl:grid-cols-[2.3fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                HDR Sports
              </p>
              <h2 className="mt-3 text-3xl font-display font-semibold">
                Elite cricket essentials crafted for global players
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Premium cricket equipment built to deliver confidence,
              performance, and reliability on every pitch. HDR Sports serves
              local and international players with trusted gear and elevated
              service.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Fast Local Dispatch</p>
                <p className="mt-2 text-sm text-slate-400">
                  Same-day processing for local shipments.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Global Delivery</p>
                <p className="mt-2 text-sm text-slate-400">
                  Dependable shipping across multiple regions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/hdr.sports"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-gold hover:bg-gold hover:text-[#0b0b0b]"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-gold hover:bg-gold hover:text-[#0b0b0b]"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 mb-5">
              Shop
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <Link to="/shop" className="block transition hover:text-gold">
                All Categories
              </Link>
              <Link
                to="/shop?categorySlug=accessories"
                className="block transition hover:text-gold"
              >
                Accessories
              </Link>
              <Link
                to="/shop?featured=true"
                className="block transition hover:text-gold"
              >
                Featured
              </Link>
              <Link
                to="/shop?categorySlug=cricket-bats"
                className="block transition hover:text-gold"
              >
                Cricket Bat
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 mb-5">
              Support
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <Link to="/orders" className="block transition hover:text-gold">
                Order History
              </Link>
              <Link
                to="/order-lookup"
                className="block transition hover:text-gold"
              >
                Track Order
              </Link>
              <Link
                to="/shipping-returns"
                className="block transition hover:text-gold"
              >
                Shipping & Returns
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 mb-5">
              Contact
            </p>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-1 text-gold" />
                <p>Rawalpindi, Pakistan</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gold" />
                <p>+92 336 5500123</p>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gold" />
                <p>HDR@sports.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-500 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 HDR Sports. All rights reserved.</p>
          <p>
            Trusted cricket brand serving Pakistan and international players.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
