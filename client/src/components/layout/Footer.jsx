import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-midnight-900 border-t border-white/10 text-white pt-16 pb-8">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold font-display text-white block">
              Talentora<span className="text-gold">AI</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              The premium AI-powered recruitment platform for the creators of tomorrow.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Github size={20} />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white font-display">Platform</h4>
            <ul className="space-y-3">
              <li><FooterLink to="/jobs">Browse Jobs</FooterLink></li>
              <li><FooterLink to="/services">Our Services</FooterLink></li>
              <li><FooterLink to="/user/resume-builder">Resume Builder</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white font-display">Company</h4>
            <ul className="space-y-3">
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white font-display">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-electric-purple" />
                hello@talentora.ai
              </li>
              <li className="text-gray-400">
                123 Innovation Drive<br />
                San Francisco, CA 94103
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Talentora AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-400 hover:text-gold transition-colors block w-fit"
  >
    {children}
  </Link>
);

const SocialIcon = ({ icon }) => (
  <a 
    href="#" 
    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:border-electric-purple transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
