import { useEffect, useRef } from 'react';
import { Target, Users, Zap, Award, Globe, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Values Animation
      gsap.fromTo(".value-card", 
        { y: 30, autoAlpha: 0 },
        { 
          y: 0, 
          autoAlpha: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          scrollTrigger: {
            trigger: ".values-section",
            start: "top bottom-=100"
          }
        }
      );
      
      // Stats Animation
      gsap.fromTo(".stat-item", 
        { scale: 0.8, autoAlpha: 0 },
        { 
          scale: 1, 
          autoAlpha: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)", 
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top bottom-=100"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-midnight-900 text-white selection:bg-electric-purple-glow selection:text-white pt-20">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-custom text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hero-text">
              <Globe className="w-4 h-4 text-electric-purple" />
              <span className="text-sm font-medium text-gray-300">Global Reach, Local Impact</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 hero-text">
              Revolutionizing <span className="text-electric-purple">Recruitment</span> <br />
              with <span className="text-gold">Artificial Intelligence</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed hero-text">
              Talentora AI was founded on a simple premise: The hiring process is broken. 
              We're fixing it by replacing bias and inefficiency with data-driven precision 
              and lightning-fast matching algorithms.
            </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative bg-midnight-800/50">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <h2 className="text-3xl font-bold font-display">Our <span className="text-gold">Mission</span></h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                To empower companies to build world-class teams instantly and to help professionals find roles 
                where they can truly thrive. We believe in a future where talent is recognized instantly, 
                regardless of geography or background.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Eliminate hiring bias through AI objectivity",
                  "Reduce time-to-hire from months to days",
                  "Prioritize skills and potential over keywords"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-electric-purple/20 flex items-center justify-center">
                      <Target className="w-3 h-3 text-electric-purple" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
           </div>
           
           <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-electric-purple to-gold opacity-20 blur-3xl rounded-full"></div>
              <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                 <div className="grid grid-cols-2 gap-6 stats-section">
                    <div className="text-center p-6 bg-midnight-900/50 rounded-2xl stat-item">
                       <div className="text-4xl font-bold text-white mb-2">98%</div>
                       <div className="text-sm text-gray-400">Match Accuracy</div>
                    </div>
                    <div className="text-center p-6 bg-midnight-900/50 rounded-2xl stat-item">
                       <div className="text-4xl font-bold text-gold mb-2">24h</div>
                       <div className="text-sm text-gray-400">Avg. Hiring Time</div>
                    </div>
                    <div className="text-center p-6 bg-midnight-900/50 rounded-2xl stat-item">
                       <div className="text-4xl font-bold text-electric-purple mb-2">50k+</div>
                       <div className="text-sm text-gray-400">Active Candidates</div>
                    </div>
                    <div className="text-center p-6 bg-midnight-900/50 rounded-2xl stat-item">
                       <div className="text-4xl font-bold text-white mb-2">500+</div>
                       <div className="text-sm text-gray-400">Enterprise Partners</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 values-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">Our Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The principles that drive our technology and our culture.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Zap className="w-8 h-8 text-gold" />}
              title="Speed & Precision"
              desc="Time is the most valuable asset. We optimize for velocity without compromising on quality."
            />
            <ValueCard 
              icon={<Shield className="w-8 h-8 text-electric-purple" />}
              title="Trust & Security"
              desc="We treat data with the highest level of security. Privacy is built into our DNA."
            />
            <ValueCard 
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Human-Centric AI"
              desc="Technology should elevate human potential, not replace it. We build tools that empower people."
            />
          </div>
        </div>
      </section>
      
      {/* Team CTA */}
      <section className="py-20 bg-gradient-to-r from-electric-purple/10 to-transparent">
        <div className="container-custom text-center">
           <h2 className="text-3xl font-bold mb-6">Join Our Jounrey</h2>
           <p className="text-gray-300 max-w-2xl mx-auto mb-8">
             We are always looking for visionaries to help us shape the future of work.
           </p>
           <button className="px-8 py-4 bg-white text-midnight-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
             View Careers
           </button>
        </div>
      </section>

    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <div className="value-card p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:shadow-[0_0_30px_-5px_rgba(255,215,0,0.15)]">
    <div className="w-14 h-14 rounded-xl bg-midnight-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">{title}</h3>
    <p className="text-gray-300 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default About;
