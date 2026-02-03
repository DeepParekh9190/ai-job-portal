import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrendingUp, Shield, Star, Zap, ChevronDown, Mail, Phone, MapPin, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  // Preloader handled globally in App.jsx now
  const [activeFAQ, setActiveFAQ] = useState(0); // Open first one by default
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  
  // Testimonials Logic
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: "Talentora AI transformed our hiring process. We found the perfect senior developer in 24 hours, and the AI matching was uncannily accurate.",
      author: "Sanya Malhotra",
      role: "CTO, TechFlow India",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces"
    },
    {
      quote: "As a candidate, I was tired of ghosting. Talentora connected me with serious companies that valued my specific skill set immediately.",
      author: "Arjun Sharma",
      role: "Senior UX Designer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
    },
    {
      quote: "The Verified Talent feature gave us complete peace of mind. We hired a remote team of five, and every single one has been a superstar.",
      author: "Priya Patel",
      role: "VP of People, InnovateBharat",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Partners Logic
  const [activePartnerPage, setActivePartnerPage] = useState(0);
  const partners = [
    { name: 'TechFlow', logo: '/logos/techflow.png' },
    { name: 'InnovateAI', logo: '/logos/innovateai.png' },
    { name: 'FutureScale', logo: '/logos/futurescale.png' },
    { name: 'CloudMatrix', logo: '/logos/cloudmatrix.png' },
    { name: 'DataSphere', logo: '/logos/datasphere.png' },
    { name: 'NeuralNet', logo: '/logos/neuralnet.png' },
    { name: 'CyberPeak', logo: '/logos/cyberpeak.png' },
    { name: 'QuantumLeap', logo: '/logos/quantumleap.png' }
  ];
  const itemsPerPage = 4; // Show 4 at a time on desktop

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePartnerPage((prev) => (prev + 1) % Math.ceil(partners.length / itemsPerPage));
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    // Hero Animation (Removed for instant load)
    const tl = gsap.timeline();
    // No animations for hero elements



    // Scroll Animations for Features
    gsap.fromTo(featuresRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-midnight-900 text-white overflow-hidden selection:bg-electric-purple-glow selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-electric-purple-glow/20 rounded-full blur-3xl mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gold-glow/10 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div ref={textRef} className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Star className="w-4 h-4 text-gold" fill="currentColor" />
              <span className="text-sm font-medium text-gold">The Future of AI Recruiting</span>
            </div>
            
            {/* Animated Title */}
            {/* Animated Title */}
            <h1 className="text-5xl lg:text-7xl font-bold font-display leading-tight mb-6">
              <span className="sr-only">Talentora AI</span>
              <span className="inline-block text-white">
                {"Talentora".split("").map((char, i) => (
                  <span key={i} className="hero-char inline-block">{char}</span>
                ))}
              </span>
              <span className="text-gold inline-block">
                {"AI".split("").map((char, i) => (
                  <span key={i} className="hero-char inline-block">{char}</span>
                ))}
              </span>
            </h1>
            
            <div ref={textRef} className="space-y-8">
              <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-lg">
                Unlock the next generation of hiring. Our AI-driven engine matches elite talent with premium opportunities in milliseconds.
              </p>
  
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  to={user ? (user.role === 'client' ? '/client/post-job' : '/jobs') : '/register'}
                  className="group relative px-8 py-4 bg-white text-midnight-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Now <Zap className="w-5 h-5 group-hover:fill-current" />
                  </span>
                </Link>
                
                <Link 
                  to="/jobs"
                  className="px-8 py-4 rounded-full font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  Browse Opportunities
                </Link>
              </div>
  
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  500+ New Jobs Today
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-electric-purple animate-pulse"></span>
                  AI Matching Active
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image / Caricature */}
          <div ref={imageRef} className="lg:w-1/2 relative">
            <div className="relative z-10 transition-transform duration-500 hover:scale-[1.02] filter drop-shadow-2xl">
              <div className="relative p-1">
                {/* Hexagon Border Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-gold via-electric-purple to-midnight-900"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                ></div>
                <img 
                  src="/hero-caricature.png" 
                  alt="Future of Work" 
                  className="w-full h-auto relative z-10 bg-midnight-800"
                  style={{ clipPath: "polygon(50% 0.5%, 99.5% 25.25%, 99.5% 74.75%, 50% 99.5%, 0.5% 74.75%, 0.5% 25.25%)" }}
                />
              </div>
            </div>
            {/* Glossy Backdrop for Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-electric-purple/20 to-gold/20 rounded-full filter blur-[100px] -z-10 opacity-60"></div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-20 relative bg-midnight-900 overflow-hidden">
         {/* Background Glows (Different positions to Testimonials) */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-electric-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container-custom mb-12 text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Trusted by <span className="text-gold">Industry Leaders</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powering the hiring process for the world's fastest-growing companies.
            </p>
        </div>
        
        <div className="relative z-10 container-custom mx-auto px-4 min-h-[120px] flex items-center justify-center">
            {/* Display current page of partners */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
              {partners.slice(activePartnerPage * itemsPerPage, (activePartnerPage + 1) * itemsPerPage).map((company, index) => (
                <div 
                  key={`${activePartnerPage}-${index}`} 
                  className="group flex items-center justify-center gap-3 animate-fade-in"
                >
                  <div className="h-32 w-64 flex items-center justify-center transition-all duration-300 filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105">
                     <img 
                       src={company.logo} 
                       alt={`${company.name} Logo`} 
                       className="h-full w-full object-contain"
                     />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress/Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
               {[...Array(Math.ceil(partners.length / itemsPerPage))].map((_, i) => (
                 <div key={i} className={`w-12 h-1 rounded-full transition-all duration-500 ${i === activePartnerPage ? 'bg-electric-purple' : 'bg-gray-800'}`}></div>
               ))}
            </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold font-display">
              Why <span className="text-gold">Talentora</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We ditched the old resume stack. Experience the speed of AI-powered recruitment designed for the modern era.
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-gold" />}
              title="Smart Analytics"
              desc="Real-time market insights and salary trends at your fingertips."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-electric-purple" />}
              title="Verified Talent"
              desc="AI-verified skills and background checks ensure you hire the best."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-blue-400" />}
              title="Instant Matching"
              desc="Our algorithms connect you with the right fit in seconds, not days."
            />
          </div>
        </div>
      </section>

      {/* AI Resume Builder Section */}
      <section className="py-24 relative overflow-hidden bg-midnight-800/30">
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image Segment */}
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-electric-purple/20 to-gold/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-sm bg-white/5 shadow-2xl">
                <img 
                  src="/ai-resume-builder.png" 
                  alt="AI Resume Builder Interface" 
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-10 -right-8 bg-midnight-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">ATS Score</p>
                    <p className="text-lg font-bold text-white">98/100</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-8 bg-midnight-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center text-electric-purple">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">AI Optimization</p>
                    <p className="text-sm font-bold text-white">Instant Feedback</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Segment */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-purple/10 border border-electric-purple/20 text-electric-purple text-xs font-bold tracking-widest uppercase">
                New Feature
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight">
                Craft Your Story with <br />
                <span className="text-electric-purple">AI Intelligence</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Our smart builder doesn't just fill templates. It analyzes your career trajectory, suggests powerful industry keywords, and optimizes your layout for both human recruiters and ATS algorithms.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-gold/20 p-1 rounded-full">
                    <Star className="w-3 h-3 text-gold" fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Dynamic AI Suggestions</p>
                    <p className="text-sm text-gray-500">Real-time content recommendations based on your unique experience.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-electric-purple/20 p-1 rounded-full">
                    <Star className="w-3 h-3 text-electric-purple" fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-bold text-white">ATS Optimization</p>
                    <p className="text-sm text-gray-500">Built-in checks to ensure your resume passes through screening bots.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                    <Star className="w-3 h-3 text-blue-400" fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Premium Exports</p>
                    <p className="text-sm text-gray-500">Download high-definition, professionally designed PDF resumes instantly.</p>
                  </div>
                </li>
              </ul>

              <div className="pt-4">
                <Link 
                  to="/user/resume-builder"
                  className="px-10 py-4 bg-gradient-to-r from-electric-purple to-indigo-600 rounded-full text-white font-bold inline-flex items-center gap-3 hover:shadow-lg hover:shadow-electric-purple/20 transition-all border border-white/5 active:scale-95"
                >
                  Start Building <Zap className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-24 relative bg-midnight-900 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-electric-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Loved by <span className="text-gold">Visionaries</span>
            </h2>
            <p className="text-gray-400">See what the world's most innovative teams are saying.</p>
          </div>

          <div className="max-w-4xl mx-auto relative h-[300px] sm:h-[250px]">
            {testimonials.map((testi, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                  index === activeTestimonial 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center relative mx-4 md:mx-0 shadow-strong hover:bg-white/10 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <img 
                      src={testi.image} 
                      alt={testi.author} 
                      className="w-12 h-12 rounded-full border-2 border-electric-purple shadow-lg shadow-electric-purple/20"
                    />
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 mb-6 relative">
                    <span className="text-electric-purple text-4xl absolute -top-4 -left-2 opacity-50">"</span>
                    {testi.quote}
                    <span className="text-electric-purple text-4xl absolute -bottom-8 -right-2 opacity-50">"</span>
                  </blockquote>

                  <div>
                    <div className="font-bold text-white text-lg">{testi.author}</div>
                    <div className="text-electric-purple text-sm font-medium">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'w-8 bg-electric-purple' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative bg-midnight-800/50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
            <p className="text-gray-400">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI matching algorithm work?",
                a: "Our AI analyzes over 50 data points including skills, experience, project history, and cultural fit to predict the best matches between candidates and companies, ensuring high long-term retention rates."
              },
              {
                q: "Is Talentora free for job seekers?",
                a: "Yes! Creating a profile, browsing jobs, and getting matched with opportunities is completely free for candidates. We only charge companies when they successfully hire."
              },
              {
                q: "How is my data protected?",
                a: "We use enterprise-grade encryption and are fully GDPR and CCPA compliant. Your personal data is never shared with third parties without your explicit consent."
              },
              {
                q: "Can I use Talentora for freelance gigs?",
                a: "Absolutely. We have a dedicated marketplace for high-end freelance contracts and fractional roles in addition to full-time opportunities."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-lg hover:text-electric-purple transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFAQ === index ? 'rotate-180 text-electric-purple' : 'text-gray-500'}`} />
                </button>
                <div 
                  className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                    activeFAQ === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW Contact Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 space-y-8">
                <h2 className="text-3xl font-bold font-display">Get in <span className="text-electric-purple">Touch</span></h2>
                <p className="text-gray-400 text-lg">
                  Have questions about our enterprise solutions? Need help with your profile? Our team is ready to assist you.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-electric-purple">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Email Us</h4>
                      <p className="text-gray-400">support@talentora.ai</p>
                      <p className="text-gray-400">enterprise@talentora.ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-gold">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Call Us</h4>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                      <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Visit Us</h4>
                      <p className="text-gray-400">100 Innovation Hub, Electronic City</p>
                      <p className="text-gray-400">Bengaluru, Karnataka 560100</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-16 bg-white/5 relative">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-300">Name</label>
                       <input type="text" placeholder="John Doe" className="w-full bg-midnight-900 border border-white/10 rounded-xl px-4 py-3 focus:border-electric-purple outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-300">Email</label>
                       <input type="email" placeholder="john@example.com" className="w-full bg-midnight-900 border border-white/10 rounded-xl px-4 py-3 focus:border-electric-purple outline-none transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-300">Message</label>
                     <textarea rows="4" placeholder="How can we help you?" className="w-full bg-midnight-900 border border-white/10 rounded-xl px-4 py-3 focus:border-electric-purple outline-none transition-colors resize-none"></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-white text-midnight-900 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
                    Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/10 to-transparent"></div>
        <div className="container-custom relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl text-center">
            <h2 className="text-4xl font-bold font-display mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of professionals who have found their dream roles through Talentora AI.
            </p>
            <Link 
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-electric-purple to-indigo-600 rounded-full text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] transition-all"
            >
              Join Talentora Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
    <div className="w-14 h-14 rounded-xl bg-midnight-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default Home;
