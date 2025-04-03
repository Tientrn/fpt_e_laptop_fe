import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";

function FooterHomePage() {
  return (
    <footer className="bg-gradient-to-r from-[#2F2F3B] to-[#3C2B64] text-white py-8">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center">
              <i className="fas fa-laptop mr-2 text-2xl"></i>
              <h1 className="text-lg text-white">FPT E-Laptop</h1>
            </div>

            <p className="mt-2 text-white/80">
              Empowering students with tools to succeed in the modern world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-home mr-2"></i>
                <a
                  href="/"
                  className="text-white/80 hover:text-amber-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-cogs mr-2"></i>
                <a
                  href="#"
                  className="text-white/80 hover:text-amber-600 transition-colors"
                >
                  Products
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-laptop mr-2"></i>
                <a
                  href="#"
                  className="text-white/80 hover:text-amber-600 transition-colors"
                >
                  Borrow Laptop
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <a
                  href="#"
                  className="text-white/80 hover:text-amber-600 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span className="text-white/80">support@example.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span className="text-white/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span className="text-white/80">Location: FPT University</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/20 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} FPT Laptop Sharing. All rights
            reserved.
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white/80 hover:text-amber-600 transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-amber-600 transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-amber-600 transition-colors"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterHomePage;
