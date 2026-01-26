import { useEffect, useRef } from 'react';
import { Bot, CheckCircle, Search, FileText, Cpu, TrendingUp, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(".hero-element", 
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );

      // Service Cards Animation
      gsap.fromTo(".service-card", 
        { y: 50, autoAlpha: 0 },
        { 
          y: 0, 
          autoAlpha: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top bottom-=100", // Triggers when top of grid is 100px above bottom of viewport
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-midnight-900 text-white selection:bg-electric-purple-glow selection:text-white pt-20">
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Decorative Bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-purple/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 hero-element">
            AI-Powered <span className="text-gold">Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 hero-element">
            From smart talent matching to automated resume analysis, we provide the tools you need to build the workforce of tomorrow.
          </p>
          <div className="flex justify-center gap-4 hero-element">
             <Link to="/register" className="px-8 py-3 bg-electric-purple rounded-full font-bold hover:bg-electric-purple-light transition-all shadow-lg shadow-electric-purple/30">
                Get Started
             </Link>
             <Link to="/contact" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-medium hover:bg-white/10 transition-all">
                Contact Sales
             </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative bg-midnight-800/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 services-grid">
            
            <ServiceCard 
              icon={<Bot className="w-8 h-8 text-gold" />}
              title="AI Talent Matching"
              desc="Our proprietary algorithm analyzes thousands of data points to find candidates that fit not just the role, but your company culture."
              features={["98% Matching Accuracy", "Instant Recommendations", "Cultural Fit Analysis"]}
            />
            
            <ServiceCard 
              icon={<FileText className="w-8 h-8 text-electric-purple" />}
              title="Smart Resume Screening"
              desc="Stop drowning in PDFs. Our AI parses, ranks, and highlights the most relevant experience instantly."
              features={["Keyword Optimization", "Skill Gap Analysis", "Ranked Candidate Lists"]}
            />
            
            <ServiceCard 
              icon={<Briefcase className="w-8 h-8 text-blue-400" />}
              title="Automated Headhunting"
              desc="We proactively reach out to passive candidates who match your criteria, engaging them with personalized messaging."
              features={["Passive Talent Pool", "Automated Outreach", "High Response Rates"]}
            />

            <ServiceCard 
              icon={<TrendingUp className="w-8 h-8 text-pink-500" />}
              title="Market Analytics"
              desc="Make data-driven hiring decisions with real-time insights into salary trends, skills demand, and competitor analysis."
              features={["Salary Benchmarking", "Talent Supply Heatmaps", "Competitor Insights"]}
            />

            <ServiceCard 
              icon={<Cpu className="w-8 h-8 text-green-400" />}
              title="Tech Assessment"
              desc="Verify coding skills and technical knowledge with our integrated, AI-proctored testing environment."
              features={["Anti-Cheat Protection", "Auto-Grading", "Real-World Scenarios"]}
            />

            <ServiceCard 
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Fast-Track Onboarding"
              desc="Streamline the transition from 'Hired' to 'Productive' with automated paperwork and onboarding workflows."
              features={["Digital Signatures", "Role-Based Checklists", "Integration Support"]}
            />

          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom">
           <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold/10 text-gold text-sm font-bold uppercase tracking-wider">
                    Enterprise
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold font-display">Custom Solutions for Scale</h2>
                 <p className="text-gray-400 text-lg">
                   Hiring for a Fortune 500? We offer dedicated support, custom API integrations, and white-label solutions tailored to your unique workflows.
                 </p>
                 <ul className="space-y-3">
                    {["Custom API Integration", "Dedicated Account Manager", "SLA Guarantees", "White-Label Portals"].map((bg, i) =>(
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-electric-purple" /> {bg}
                      </li>
                    ))}
                 </ul>
                 <button className="mt-4 px-8 py-3 bg-white text-midnight-900 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                    Talk to Enterprise Sales
                 </button>
              </div>
              <div className="md:w-1/2">
                 <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full"></div>
                    {/* Placeholder Logic */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative z-10 aspect-video flex items-center justify-center">
                       <Cpu className="w-20 h-20 text-white/20" />
                       <div className="absolute bottom-4 left-6 right-6">
                           <div className="h-2 bg-white/10 rounded-full mb-2 w-3/4"></div>
                           <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

const ServiceCard = ({ icon, title, desc, features }) => (
  <div className="service-card p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-electric-purple/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] group">
    <div className="w-12 h-12 rounded-lg bg-midnight-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold transition-colors">{title}</h3>
    <p className="text-gray-300 mb-6 leading-relaxed min-h-[80px]">
      {desc}
    </p>
    <ul className="space-y-2 border-t border-white/10 pt-4">
      {features.map((feat, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
           <CheckCircle className="w-4 h-4 text-gold" /> {feat}
        </li>
      ))}
    </ul>
  </div>
);

export default Services;
