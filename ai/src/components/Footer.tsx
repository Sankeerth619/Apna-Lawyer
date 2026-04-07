import React from 'react';
import { Scale, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 mt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto glass p-10 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-neon-gold to-neon-blue rounded-lg">
                <Scale className="w-6 h-6 text-dark-base" />
              </div>
              <span className="text-2xl font-serif font-bold text-gradient-gold">Apna-Lawyer</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Democratizing legal access through advanced artificial intelligence. Your futuristic legal defender, available 24/7.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 glass glass-hover rounded-full text-white/60 hover:text-neon-blue">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 glass glass-hover rounded-full text-white/60 hover:text-neon-blue">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 glass glass-hover rounded-full text-white/60 hover:text-neon-blue">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-neon-blue transition-colors">About Us</Link></li>
              <li><Link to="/bot" className="hover:text-neon-blue transition-colors">AI Legal Bot</Link></li>
              <li><Link to="/reviews" className="hover:text-neon-blue transition-colors">User Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-neon-blue transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-neon-blue transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-neon-blue transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neon-gold" />
                <span>support@apna-lawyer.io</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neon-gold" />
                <span>+91 800 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neon-gold" />
                <span>Bangalore, Kengeri 560060</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2026 Apna-Lawyer Technologies. All rights reserved.</p>
          <p className="text-center md:text-right italic">
            Disclaimer: Apna-Lawyer is an AI assistant and does not constitute professional legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
