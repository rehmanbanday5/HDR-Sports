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
        {/* Top */}
        <div className="grid gap-12 xl:grid-cols-[2.3fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
                HDR Sports
              </p>

              <h2 className="mt-3 text-3xl font-display font-semibold">
                Elite Cricket Essentials Crafted For Global Players
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Premium cricket equipment built to deliver confidence,
              performance, and reliability on every pitch. HDR Sports serves
              local and international players with trusted gear and elevated
              service.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/hdr.sports"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">
              Shop
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <Link to="/shop" className="block hover:text-[#D4AF37]">
                All Categories
              </Link>

              <Link
                to="/shop?categorySlug=accessories"
                className="block hover:text-[#D4AF37]"
              >
                Accessories
              </Link>

              <Link
                to="/shop?featured=true"
                className="block hover:text-[#D4AF37]"
              >
                Featured
              </Link>

              <Link
                to="/shop?categorySlug=cricket-bats"
                className="block hover:text-[#D4AF37]"
              >
                Cricket Bats
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">
              Support
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <Link to="/return-policy" className="block hover:text-[#D4AF37]">
                Return Policy
              </Link>

              <Link
                to="/shipping-policy"
                className="block hover:text-[#D4AF37]"
              >
                Shipping Policy
              </Link>

              <Link to="/privacy-policy" className="block hover:text-[#D4AF37]">
                Privacy Policy
              </Link>

              <Link to="/terms" className="block hover:text-[#D4AF37]">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">
              Contact
            </p>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-1 text-[#D4AF37]" />
                <p>Rawalpindi, Pakistan</p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-[#D4AF37]" />
                <p>+92 336 5500123</p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#D4AF37]" />
                <p>HDR@sports.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            {/* Left */}
            <p className="text-sm text-slate-500">
              © 2026{" "}
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-semibold text-[#D4AF37] transition hover:text-white"
              >
                HDR Sports
              </Link>
              . All rights reserved.
            </p>

            {/* Payments */}
            {/* Payments */}
            <div className="flex items-center gap-5">
              <img
                src="/payments/easypaisa.png"
                alt="EasyPaisa"
                className="h-7 w-auto object-contain transition hover:scale-105"
              />

              <img
                src="/payments/jazzcash.png"
                alt="JazzCash"
                className="h-7 w-auto object-contain transition hover:scale-105"
              />

              <img
                src="/payments/stripe.svg"
                alt="Stripe"
                className="h-7 w-auto object-contain transition hover:scale-105"
              />

              <img
                src="/payments/paypal.png"
                alt="PayPal"
                className="h-10 w-auto object-contain transition hover:scale-105"
              />
            </div>

            {/* Right */}
            <p className="text-center text-sm text-slate-500 lg:text-right">
              Trusted Cricket Brand Serving Pakistan And International Players.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
