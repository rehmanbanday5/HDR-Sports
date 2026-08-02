import React from "react";
import { Link } from "react-router-dom";
import {  FaInstagram, FaWhatsapp, FaLocationDot, FaEnvelope, FaPhone} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white mt-40 pt-1 pb-6 sm:pb-8">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-12 my-10 text-sm">
          {/* HDR Sports */}
          <div>
            <div className="mb-5">
              <h2 className="text-3xl font-medium">HDR Sports</h2>
              <div className="w-12 h-[3px] bg-[#c89116] mt-2"></div>
            </div>

            <p className="w-full md:w-2/3 text-gray-400">
              Premium cricket equipment built for the game — from professional
              cricket bats to protective gear. Serving Pakistan and shipping
              worldwide.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/hdr.sports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[45px] h-[45px] rounded-full border border-gray-300 flex items-center justify-center text-white text-lg transition-all duration-300 hover:bg-[#c89116] hover:border-[#c89116] hover:-translate-y-1"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[45px] h-[45px] rounded-full border border-gray-300 flex items-center justify-center text-white text-lg transition-all duration-300 hover:bg-[#c89116] hover:border-[#c89116] hover:-translate-y-1"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="mb-5">
              <p className="text-xl font-medium">SHOP</p>
              <div className="w-12 h-[3px] bg-[#c89116] mt-2"></div>
            </div>

            <ul className="flex flex-col gap-3 text-gray-300">
              <Link to="/shop" className="hover:text-[#c89116] transition">
                All Categories
              </Link>

              <Link
                to="/shop?categorySlug=accessories"
                className="hover:text-[#c89116] transition"
              >
                Accessories
              </Link>

              <Link
                to="/shop?featured=true"
                className="hover:text-[#c89116] transition"
              >
                Featured
              </Link>

              <Link
                to="/shop?categorySlug=cricket-bats"
                className="hover:text-[#c89116] transition"
              >
                Cricket Bat
              </Link>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="mb-5">
              <p className="text-xl font-medium">SUPPORT</p>
              <div className="w-12 h-[3px] bg-[#c89116] mt-2"></div>
            </div>

            <ul className="flex flex-col gap-3 text-gray-300">
              <Link to="/orders" className="hover:text-[#c89116] transition">
                Order History
              </Link>

              <Link
                to="/order-lookup"
                className="hover:text-[#c89116] transition"
              >
                Track Order
              </Link>

              <Link
                to="/shipping-returns"
                className="hover:text-[#c89116] transition"
              >
                Shipping & Returns
              </Link>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <div className="mb-5">
              <p className="text-xl font-medium">GET IN TOUCH</p>
              <div className="w-12 h-[3px] bg-[#c89116] mt-2"></div>
            </div>

            <div className="flex flex-col gap-4 text-gray-300">
              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-1 text-[#c89116]" />
                <p>Rawalpindi, Pakistan</p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-[#c89116]" />
                <p>+92 336 5500123</p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#c89116]" />
                <p>HDR@sports.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}

        <div className="border-t border-gray-700 mt-20 pt-5">
          <p className="text-center text-md text-gray-400">
            Copyright © 2026{" "}
            <a
              href="/"
              className="
              text-white
              hover:text-[#D4AF37]
              transition duration-300
              "
            >
              HDR Sports
            </a>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;