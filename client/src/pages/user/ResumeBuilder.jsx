import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Download, Plus, Trash2, Wand2, FileText, 
  User, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Layout, Image as ImageIcon, X, Palette, RefreshCw 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ResumeBuilder = () => {
  const { user } = useSelector((state) => state.auth);
  const previewRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('#7C3AED'); // Brand Purple default
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('ats-classic');
  const [resumeImage, setResumeImage] = useState(null);

  const colors = [
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#059669' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Slate', value: '#475569' },
    { name: 'Black', value: '#000000' },
  ];

  const sampleResumeData = {
    personal: {
      fullName: 'Dr. Sarah J. Mitchell',
      email: 'sarah.mitchell@tech-solutions.io',
      phone: '+1 (555) 123-9876',
      location: 'San Francisco, CA • Open to Relocation',
      jobTitle: 'Senior Software Architect & Team Lead',
      summary: 'Distinguished Software Architect with over 10 years of experience in designing scalable distributed systems and leading high-performance engineering teams. Expert in cloud-native architectures, microservices, and AI integration. Proven track record of reducing infrastructure costs by 40% while improving system reliability up to 99.99%. Passionate about mentorship and fostering diverse, inclusive engineering cultures.',
    },
    education: [
      { id: 1, school: 'Stanford University', degree: 'Ph.D. in Computer Science (Artificial Intelligence)', year: '2012 - 2016' },
      { id: 2, school: 'University of California, Berkeley', degree: 'B.S. in Electrical Engineering and Computer Sciences', year: '2008 - 2012' }
    ],
    experience: [
      { 
        id: 1, 
        company: 'QuantumLeap Innovations', 
        role: 'Principal Software Architect', 
        duration: '2021 - Present', 
        description: '• Spearheaded the migration of a monolithic legacy system to a microservices architecture using Kubernetes and Istio, improving deployment frequency by 200%.\n• Designed and implemented a real-time data processing pipeline handling 50TB+ of data daily, utilizing Apache Kafka and Flink.\n• Led a cross-functional team of 15 senior engineers, conducting code reviews and architectural audits to ensure compliance with SOC2 security standards.\n• Reduced annual cloud infrastructure costs by $1.2M through strategic resource optimization and spot instance utilization.' 
      },
      { 
        id: 2, 
        company: 'Nebula Cloud Systems', 
        role: 'Senior Backend Engineer', 
        duration: '2018 - 2021', 
        description: '• Developed high-throughput RESTful APIs and gRPC services for a global content delivery network serving millions of concurrent users.\n• Optimized database performance by implementing sharding and caching strategies in PostgreSQL and Redis, reducing query latency by 50%.\n• Mentored 4 junior developers who were subsequently promoted to senior roles within 18 months.\n• Championed the adoption of Test-Driven Development (TDD) and CI/CD best practices, resulting in a 30% reduction in production bugs.' 
      },
      { 
        id: 3, 
        company: 'InnovateX Startups', 
        role: 'Full Stack Developer', 
        duration: '2016 - 2018', 
        description: '• Built the MVP for a fintech application from scratch using React, Node.js, and MongoDB, helping the company secure Series A funding.\n• Implemented secure authentication and authorization flows utilizing OAuth 2.0 and JWT.\n• Collaborated closely with product managers and designers to iterate rapidly on user feedback, achieving a 4.8/5 star rating on the App Store.' 
      }
    ],
    skills: 'System Design, Microservices, Kubernetes, Docker, AWS (Solutions Architect Professional), Google Cloud Platform, Python, Go, Java, React, Node.js, PostgreSQL, MongoDB, Redis, Apache Kafka, CI/CD (Jenkins, GitLab), Agile Methodologies, Team Leadership, Mentoring'
  };

  const handleLoadSample = () => {
    setResumeData(sampleResumeData);
    toast.success('Sample data loaded!');
  };

  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      jobTitle: '',
      summary: ''
    },
    education: [
      { id: 1, school: '', degree: '', year: '' }
    ],
    experience: [
      { id: 1, company: '', role: '', duration: '', description: '' }
    ],
    skills: ''
  });

  // --- Handlers ---
  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [e.target.name]: e.target.value }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExperienceChange = (id, field, value) => {
    const updatedExp = resumeData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResumeData({ ...resumeData, experience: updatedExp });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience, 
        { id: Date.now(), company: '', role: '', duration: '', description: '' }
      ]
    });
  };

  const removeExperience = (id) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const handleEducationChange = (id, field, value) => {
    const updatedEdu = resumeData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setResumeData({ ...resumeData, education: updatedEdu });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: Date.now(), school: '', degree: '', year: '' }
      ]
    });
  };

  const removeEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const handleAiEnhance = async () => {
    try {
      setIsGenerating(true);
      
      // Prepare data for AI
      const payload = {
        name: resumeData.personal.fullName,
        email: resumeData.personal.email,
        phone: resumeData.personal.phone,
        jobTitle: resumeData.personal.jobTitle,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills.split(',').filter(s => s.trim())
      };

      const response = await api.post('/ai/generate-resume', payload);
      
      if (response.success && response.resume) {
        const aiContent = response.resume;
        
        // Map backend response to frontend state
        setResumeData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            summary: aiContent.summary
          },
          experience: aiContent.experience.map((exp, index) => ({
             id: prev.experience[index]?.id || Date.now() + index,
             company: exp.company || prev.experience[index]?.company || '',
             role: exp.title || prev.experience[index]?.role || '',
             duration: exp.duration || prev.experience[index]?.duration || '',
             description: exp.description || prev.experience[index]?.description || ''
          })),
          skills: Array.isArray(aiContent.skills) 
            ? aiContent.skills.join(', ') 
            : (aiContent.skills?.technical || []).concat(aiContent.skills?.soft || []).join(', ')
        }));
        
        toast.success(response.message || 'Resume enhanced by AI!');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      // Fallback to sample data if API fails
      setResumeData(sampleResumeData);
      toast.error('AI Service unavailable (Check API Keys). Loaded sample profile instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    const element = previewRef.current;
    const clone = element.cloneNode(true);
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.zIndex = '-1000';
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(clone, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        windowWidth: 794 // A4 width @ 96 DPI
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Subsequent pages
      while (heightLeft > 0) {
        position -= pdfHeight; // Move image up
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      toast.success('Resume downloaded!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      document.body.removeChild(container);
    }
  };

  // --- Template Renders ---

  // 1. ATS Classic (No Image, Serif, Standard List)
  const renderAtsClassic = () => (
    <div className="font-serif text-black p-[25mm] h-full" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: selectedColor }}>
        <h1 className="text-4xl font-bold uppercase tracking-wide" style={{ color: selectedColor }}>{resumeData.personal.fullName || 'YOUR NAME'}</h1>
        <div className="text-base flex flex-wrap justify-center gap-4 mt-3 text-gray-700">
          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
        </div>
      </div>

      {resumeData.personal.summary && (
        <div className="mb-8">
          <h2 className="text-base font-bold uppercase border-b mb-3 pb-1" style={{ color: selectedColor, borderColor: selectedColor }}>Professional Summary</h2>
          <p className="text-base leading-7 text-justify text-gray-800">{resumeData.personal.summary}</p>
        </div>
      )}

      {resumeData.skills && (
         <div className="mb-8">
            <h2 className="text-base font-bold uppercase border-b mb-3 pb-1" style={{ color: selectedColor, borderColor: selectedColor }}>Technical Skills</h2>
            <ul className="list-disc pl-5 text-base leading-7 text-gray-800">
               {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                  <li key={i} className="mb-1">{skill.trim()}</li>
               ))}
            </ul>
         </div>
      )}

      <div className="mb-8">
        <h2 className="text-base font-bold uppercase border-b mb-4 pb-1" style={{ color: selectedColor, borderColor: selectedColor }}>Experience</h2>
        {resumeData.experience.map(exp => (
          <div key={exp.id} className="mb-6 last:mb-0">
            <div className="flex justify-between font-bold text-base align-baseline">
              <span style={{ color: '#000', fontSize: '1.1em' }}>{exp.company}</span>
              <span className="text-gray-700">{exp.duration}</span>
            </div>
            <div className="italic text-base mb-2 font-medium" style={{ color: selectedColor }}>{exp.role}</div>
            <p className="text-base leading-7 text-gray-800 whitespace-pre-wrap pl-1">{exp.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b mb-4 pb-1" style={{ color: selectedColor, borderColor: selectedColor }}>Education</h2>
        {resumeData.education.map(edu => (
          <div key={edu.id} className="mb-4 text-base last:mb-0">
            <div className="flex justify-between font-bold">
              <span style={{ fontSize: '1.05em' }}>{edu.school}</span>
              <span className="text-gray-700">{edu.year}</span>
            </div>
            <div className="text-gray-800 mt-1">{edu.degree}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. Modern Sidebar (With Image, San-Serif)
  const renderModern = () => (
    <div className="flex h-full font-sans text-gray-800">
      {/* Sidebar - Gray Background */}
      <div className="w-1/3 bg-slate-100 text-slate-800 p-8 flex flex-col gap-10 border-r border-slate-300">
        <div className="flex flex-col items-center text-center">
          {resumeImage ? (
            <img src={resumeImage} alt="Profile" className="w-48 h-48 rounded-full object-cover mb-6 border-8 border-white shadow-xl" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-slate-300 flex items-center justify-center mb-6 text-6xl font-bold text-white shadow-xl">
              {resumeData.personal.fullName?.[0]}
            </div>
          )}
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-slate-300 pb-2 mb-2 w-full">Contact</h2>
        </div>

        <div className="space-y-4 text-sm font-medium tracking-wide">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 text-white rounded-full"><Mail size={14} /></div>
              <span className="break-all">{resumeData.personal.email}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 text-white rounded-full"><Phone size={14} /></div>
              <span>{resumeData.personal.phone}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 text-white rounded-full"><MapPin size={14} /></div>
              <span>{resumeData.personal.location}</span>
           </div>
        </div>

        <div>
           <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-slate-300 pb-2 mb-6">Education</h3>
           {resumeData.education.map(edu => (
             <div key={edu.id} className="mb-6 last:mb-0">
               <div className="font-bold text-slate-900 text-lg uppercase">{edu.year}</div>
               <div className="font-bold text-slate-700 text-base">{edu.school}</div>
               <div className="text-slate-600 text-sm mt-1 italic">{edu.degree}</div>
             </div>
           ))}
        </div>

        <div>
           <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-slate-300 pb-2 mb-6">Skills</h3>
           <ul className="space-y-3">
             {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
               <li key={i} className="text-sm font-bold text-slate-700 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                  {skill.trim()}
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 flex flex-col">
         {/* Header Section */}
         <div className="p-12 pb-8">
            <h1 className="text-6xl font-black text-slate-800 uppercase tracking-tighter mb-4" style={{ color: selectedColor }}>{resumeData.personal.fullName}</h1>
            <div className="py-3 px-8 -ml-12 w-[calc(100%+3rem)] bg-slate-800 text-white uppercase tracking-[0.2em] font-bold text-lg" style={{ backgroundColor: selectedColor }}>
               {resumeData.personal.jobTitle}
            </div>
         </div>

         <div className="p-12 pt-4 flex-grow flex flex-col gap-10">
            {resumeData.personal.summary && (
              <div>
                <h3 className="text-2xl font-black uppercase text-slate-800 tracking-widest mb-6">Profile</h3>
                <p className="text-base text-gray-600 leading-8 text-justify">{resumeData.personal.summary}</p>
              </div>
            )}

            <div>
                <h3 className="text-2xl font-black uppercase text-slate-800 tracking-widest mb-8">Work Experience</h3>
                <div className="border-l-4 border-slate-200 ml-3 space-y-10">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} className="relative pl-8">
                       {/* Timeline Dot */}
                       <div className="absolute -left-[11px] top-1.5 w-5 h-5 bg-white border-4 border-slate-800 rounded-none transform rotate-45" style={{ borderColor: selectedColor }}></div>
                       
                       <div className="flex justify-between items-baseline mb-2">
                          <h4 className="font-bold text-slate-900 text-xl uppercase">{exp.company}</h4>
                          <span className="font-bold text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{exp.duration}</span>
                       </div>
                       <div className="text-lg font-bold mb-4 italic" style={{ color: selectedColor }}>{exp.role}</div>
                       <p className="text-base text-gray-600 leading-7 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );

  // 3. Minimal (Sebastian Bennett Style)
  const renderMinimal = () => (
    <div className="h-full p-[20mm] text-gray-800 font-sans border-t-8" style={{ borderColor: selectedColor }}>
       {/* Header */}
       <div className="text-center mb-10">
         <h1 className="text-5xl font-extrabold uppercase tracking-wide text-slate-900 mb-2">{resumeData.personal.fullName}</h1>
         <p className="text-2xl text-slate-600 font-light tracking-wider">{resumeData.personal.jobTitle}</p>
         
         <div className="flex justify-center items-center gap-6 mt-6 text-sm font-medium text-slate-500">
            {resumeData.personal.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} style={{ color: selectedColor }} /> {resumeData.personal.phone}
              </div>
            )}
            {resumeData.personal.email && (
              <div className="flex items-center gap-2">
                 <Mail size={14} style={{ color: selectedColor }} /> {resumeData.personal.email}
              </div>
            )}
            {resumeData.personal.location && (
              <div className="flex items-center gap-2">
                 <MapPin size={14} style={{ color: selectedColor }} /> {resumeData.personal.location}
              </div>
            )}
         </div>
       </div>

       {/* About Me */}
       {resumeData.personal.summary && (
         <div className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-300 pb-2 mb-4">About Me</h3>
            <p className="text-base text-slate-700 leading-relaxed text-justify">{resumeData.personal.summary}</p>
         </div>
       )}

       {/* Education */}
       <div className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-300 pb-2 mb-4">Education</h3>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                   <span className="text-base text-slate-600 font-medium">{edu.school} | {edu.year}</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{edu.degree}</div>
                <p className="text-sm text-slate-500 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
       </div>

       {/* Work Experience */}
       <div className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-300 pb-2 mb-4">Work Experience</h3>
          {resumeData.experience.map(exp => (
             <div key={exp.id} className="mb-6 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                   <span className="text-base text-slate-600 font-medium">{exp.company} | {exp.duration}</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mb-2">{exp.role}</div>
                <p className="text-base text-slate-700 leading-7 whitespace-pre-wrap">{exp.description}</p>
             </div>
          ))}
       </div>

       {/* Skills */}
       <div>
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-300 pb-2 mb-4">Skills</h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-8">
             {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
               <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" style={{ backgroundColor: selectedColor }}></div>
                  <span className="text-base text-slate-700 font-medium">{skill.trim()}</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">Resume Builder</h1>
            <p className="text-gray-400">Choose an ATS-friendly template and build your future.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <button 
              onClick={handleAiEnhance}
              disabled={isGenerating}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-white border border-white/10 rounded-lg hover:border-electric-purple/50 transition-all disabled:opacity-50"
            >
              <Wand2 size={18} className={`text-electric-purple ${isGenerating ? "animate-spin" : "group-hover:rotate-12 transition-transform"}`} />
              {isGenerating ? 'AI Optimizing...' : 'AI Enhance Content'}
            </button>
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white text-midnight-900 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-lg hover:shadow-white/20"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* EDITOR COLUMN (Left) */}
          <div className="lg:col-span-5 space-y-6">
             
             {/* 1. Template Selector */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Layout size={16}/> Select Template</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ats-classic', name: 'ATS Classic', desc: 'No Image, High Readability' },
                    { id: 'modern', name: 'Modern', desc: 'Sidebar, with Photo' },
                    { id: 'minimal', name: 'Minimalist', desc: 'Clean, Balanced' },
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTemplate === t.id 
                          ? 'bg-electric-purple border-electric-purple text-white shadow-lg shadow-electric-purple/20' 
                          : 'bg-midnight-800 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{t.name}</div>
                      <div className="text-[10px] opacity-70 leading-tight">{t.desc}</div>
                    </button>
                  ))}
                </div>
             </div>

             {/* 1.5 Color & Actions */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col gap-4">
                   <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Palette size={16}/> Color Theme</h3>
                      <div className="flex gap-2">
                         {colors.map(c => (
                           <button 
                             key={c.name}
                             onClick={() => setSelectedColor(c.value)}
                             className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                             style={{ backgroundColor: c.value }}
                             title={c.name}
                           />
                         ))}
                      </div>
                   </div>
                   
                   <div className="pt-4 border-t border-white/10">
                      <button 
                        onClick={handleLoadSample}
                        className="w-full py-2 bg-midnight-800 text-gray-300 rounded-lg hover:bg-midnight-700 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-bold"
                      >
                         <RefreshCw size={14} /> Load Sample Data
                      </button>
                   </div>
                </div>
             </div>

             {/* 2. Form Tabs */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex bg-midnight-800 p-1 rounded-xl mb-6 overflow-x-auto">
                    {['personal', 'experience', 'education', 'skills'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                          activeTab === tab 
                            ? 'bg-electric-purple text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                </div>

                <div className="space-y-6">
                  {/* Personal */}
                  {activeTab === 'personal' && (
                    <div className="space-y-4 animate-fade-in">
                       {/* Image Upload */}
                       <div className="flex items-center gap-4 p-4 bg-midnight-900 rounded-xl border border-white/5">
                          {resumeImage ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                              <img src={resumeImage} alt="Preview" className="w-full h-full object-cover" />
                              <button onClick={() => setResumeImage(null)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><X size={16}/></button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                              <ImageIcon size={24} className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Profile Photo (Optional)</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-electric-purple file:text-white hover:file:bg-electric-purple-light" />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <input name="fullName" value={resumeData.personal.fullName} onChange={handlePersonalChange} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none" placeholder="Full Name" />
                          <input name="jobTitle" value={resumeData.personal.jobTitle} onChange={handlePersonalChange} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none" placeholder="Target Job Title" />
                       </div>
                       <input name="email" value={resumeData.personal.email} onChange={handlePersonalChange} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none" placeholder="Email Address" />
                       <div className="grid grid-cols-2 gap-4">
                          <input name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none" placeholder="Phone Number" />
                          <input name="location" value={resumeData.personal.location} onChange={handlePersonalChange} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none" placeholder="City, Country" />
                       </div>
                       <textarea name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} rows={4} className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-electric-purple outline-none resize-none" placeholder="Professional Summary..." />
                    </div>
                  )}

                  {/* Experience */}
                  {activeTab === 'experience' && (
                    <div className="space-y-4 animate-fade-in">
                      {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-midnight-900 rounded-xl border border-white/5 relative group">
                           <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                           <div className="grid grid-cols-2 gap-3 mb-3">
                              <input placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} className="bg-transparent border-b border-white/10 p-2 text-white text-sm focus:border-electric-purple outline-none" />
                              <input placeholder="Role" value={exp.role} onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)} className="bg-transparent border-b border-white/10 p-2 text-white text-sm focus:border-electric-purple outline-none" />
                           </div>
                           <input placeholder="Duration" value={exp.duration} onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-white text-sm mb-3 focus:border-electric-purple outline-none" />
                           <textarea placeholder="Description" value={exp.description} onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)} rows={3} className="w-full bg-transparent border border-white/10 rounded p-2 text-white text-sm resize-none focus:border-electric-purple outline-none" />
                        </div>
                      ))}
                      <button onClick={addExperience} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Position
                      </button>
                    </div>
                  )}

                  {/* Education */}
                  {activeTab === 'education' && (
                    <div className="space-y-4 animate-fade-in">
                      {resumeData.education.map((edu, index) => (
                         <div key={edu.id} className="p-4 bg-midnight-900 rounded-xl border border-white/5 relative group">
                           <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                           <div className="grid grid-cols-2 gap-3 mb-3">
                              <input placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)} className="bg-transparent border-b border-white/10 p-2 text-white text-sm focus:border-electric-purple outline-none" />
                              <input placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} className="bg-transparent border-b border-white/10 p-2 text-white text-sm focus:border-electric-purple outline-none" />
                           </div>
                           <input placeholder="Year" value={edu.year} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-white text-sm focus:border-electric-purple outline-none" />
                         </div>
                      ))}
                      <button onClick={addEducation} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Education
                      </button>
                    </div>
                  )}

                  {/* Skills */}
                  {activeTab === 'skills' && (
                    <div className="space-y-4 animate-fade-in">
                      <textarea 
                        value={resumeData.skills} 
                        onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} 
                        rows={6} 
                        className="w-full bg-midnight-900 border border-white/10 rounded-lg p-3 text-white focus:border-electric-purple outline-none resize-none" 
                        placeholder="Comma separated skills..." 
                      />
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* PREVIEW COLUMN (Right) */}
          <div className="lg:col-span-7 bg-gray-900 rounded-2xl p-4 md:p-8 flex justify-center items-start shadow-inner">
             <div 
               ref={previewRef}
               className="bg-white text-black w-[210mm] min-h-[297mm] h-auto shadow-2xl origin-top transition-all duration-300"
               style={{ 
                 backgroundImage: 'linear-gradient(to bottom, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)', 
                 backgroundSize: '100% 297mm' 
               }}
             >
                {selectedTemplate === 'ats-classic' && renderAtsClassic()}
                {selectedTemplate === 'modern' && renderModern()}
                {selectedTemplate === 'minimal' && renderMinimal()}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
