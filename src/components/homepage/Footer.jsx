import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function FooterHomePage() {
  return (
    <footer className="bg-[#2F2F3B] text-white py-10">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-6">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-2">
              <i className="fas fa-laptop mr-2 text-2xl"></i>
              <h1 className="text-xl font-bold text-white tracking-wide">FPT E-Laptop</h1>
            </div>
            <p className="mt-1 text-white/80 text-sm max-w-xs">
              Empowering students with tools to succeed in the modern world.
            </p>
            <p className="mt-2 text-amber-300 text-xs italic font-medium">Connecting knowledge, sharing future.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="/laptopshop" className="hover:text-amber-400 transition-colors">Laptop Shop</a></li>
              <li><a href="/laptopborrow" className="hover:text-amber-400 transition-colors">Laptop Borrow</a></li>
              <li><a href="/sponsor/register" className="hover:text-amber-400 transition-colors">Donate Laptop</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span className="text-white/80">trannhattien160802@gmail.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span className="text-white/80">+84 33 749 6879</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span className="text-white/80">Location: FPT University</span>
              </li>
            </ul>
            <div>
              <h3 className="text-base font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors text-2xl">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors text-2xl">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors text-2xl">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/60">Let's connect and grow together!</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/20 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-white/80 text-sm text-center">
            © {new Date().getFullYear()} FPT Laptop Sharing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterHomePage;
