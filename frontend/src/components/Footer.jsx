import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => (
  <footer className="bg-ink text-chalk mt-24">
    <div className="container-gully py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <span className="font-display text-2xl font-bold">GULLY</span>
        <p className="text-sm text-chalk/60 mt-3 leading-relaxed">
          Premium cricket equipment built for the game — from gully wickets to the international stage. Serving
          Pakistan and shipping worldwide.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center border border-chalk/20 rounded-full hover:border-chalk/60 transition-colors text-[10px] font-mono font-semibold">
            IG
          </a>
          <a href="#" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center border border-chalk/20 rounded-full hover:border-chalk/60 transition-colors text-[10px] font-mono font-semibold">
            FB
          </a>
        </div>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-willow mb-4">Shop</h4>
        <ul className="space-y-2.5 text-sm text-chalk/70">
          <li><Link to="/shop?categorySlug=cricket-bats" className="hover:text-chalk">Cricket Bats</Link></li>
          <li><Link to="/shop?categorySlug=cricket-balls" className="hover:text-chalk">Cricket Balls</Link></li>
          <li><Link to="/shop?featured=true" className="hover:text-chalk">Featured</Link></li>
          <li><Link to="/shop?newArrival=true" className="hover:text-chalk">New Arrivals</Link></li>
          <li><Link to="/shop?bestSeller=true" className="hover:text-chalk">Best Sellers</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-willow mb-4">Support</h4>
        <ul className="space-y-2.5 text-sm text-chalk/70">
          <li><Link to="/order-lookup" className="hover:text-chalk">Track an Order</Link></li>
          <li><Link to="/orders" className="hover:text-chalk">Order History</Link></li>
          <li><a href="#" className="hover:text-chalk">Shipping &amp; Returns</a></li>
          <li><a href="#" className="hover:text-chalk">Size Guide</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-willow mb-4">Get in Touch</h4>
        <ul className="space-y-2.5 text-sm text-chalk/70">
          <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> Rawalpindi, Punjab, Pakistan</li>
          <li className="flex items-center gap-2"><Phone size={15} /> +92 300 1234567</li>
          <li className="flex items-center gap-2"><Mail size={15} /> hello@gullycricket.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-chalk/10 py-5 text-center text-xs text-chalk/50 font-mono">
      © {new Date().getFullYear()} GULLY Cricket Co. All rights reserved.
    </div>
  </footer>
);

export default Footer;
