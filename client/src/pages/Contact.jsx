import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, Linkedin, Twitter, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-anim", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-midnight-900 text-white selection:bg-electric-purple-glow selection:text-white pt-20">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-purple/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md contact-anim">
              <Mail className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gray-300">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display contact-anim">
            We'd Love to <span className="text-electric-purple">Hear to You</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto contact-anim">
            Whether you have a question about features, pricing, or enterprise solutions, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
           
           {/* Contact Info */}
           <div className="space-y-8 contact-anim">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                 <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                 <div className="space-y-6">
                    <ContactItem 
                      icon={<Mail className="w-6 h-6 text-gold" />}
                      title="Email Us"
                      content="support@talentora.ai"
                      link="mailto:support@talentora.ai"
                    />
                    <ContactItem 
                      icon={<Phone className="w-6 h-6 text-electric-purple" />}
                      title="Call Us"
                      content="+1 (555) 123-4567"
                      link="tel:+15551234567"
                    />
                    <ContactItem 
                      icon={<MapPin className="w-6 h-6 text-blue-400" />}
                      title="Visit Us"
                      content="123 AI Boulevard, Tech District, San Francisco, CA 94107"
                    />
                 </div>
              </div>

              <div className="bg-gradient-to-r from-electric-purple/20 to-midnight-800 border border-white/10 p-8 rounded-3xl">
                 <h3 className="text-xl font-bold mb-4">Connect on Social</h3>
                 <div className="flex gap-4">
                    <SocialBtn icon={<Linkedin className="w-5 h-5" />} />
                    <SocialBtn icon={<Twitter className="w-5 h-5" />} />
                    <SocialBtn icon={<Github className="w-5 h-5" />} />
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="contact-anim">
              <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-md">
                 {submitted ? (
                   <div className="text-center py-20 animate-fade-in">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                         <Send className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="mt-8 text-electric-purple hover:text-white font-medium transition-colors"
                      >
                        Send another message
                      </button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="First Name" placeholder="John" />
                        <InputGroup label="Last Name" placeholder="Doe" />
                      </div>
                      <InputGroup label="Email Address" type="email" placeholder="john@example.com" />
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Message</label>
                        <textarea 
                          rows="4" 
                          className="w-full bg-midnight-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all resize-none"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-electric-purple to-indigo-600 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            Send Message <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                   </form>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, title, content, link }) => (
  <div className="flex items-start gap-4">
     <div className="w-12 h-12 rounded-xl bg-midnight-900 border border-white/5 flex items-center justify-center shrink-0">
        {icon}
     </div>
     <div>
        <h4 className="font-bold text-white">{title}</h4>
        {link ? (
          <a href={link} className="text-gray-400 hover:text-electric-purple transition-colors">{content}</a>
        ) : (
          <p className="text-gray-400">{content}</p>
        )}
     </div>
  </div>
);

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-electric-purple hover:text-white transition-all">
    {icon}
  </button>
);

const InputGroup = ({ label, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <input 
      type={type} 
      className="w-full bg-midnight-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
      placeholder={placeholder}
      required
    />
  </div>
);

export default Contact;
