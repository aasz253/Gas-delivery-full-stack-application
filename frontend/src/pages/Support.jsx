import React from 'react';
import { 
  Phone, Mail, MapPin, Globe, Github, Linkedin, 
  MessageCircle, ArrowLeft, ExternalLink, ShieldCheck,
  Code2, Rocket, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();

  const contactInfo = {
    name: "Sifuna Codex",
    location: "Kakamega, Kenya",
    phone: "0792325646",
    whatsapp: "254792325646",
    email: "antonysifuna07@gmail.com",
    portfolio: "https://sifunacodexprofesionalpotfolio.netlify.app/",
    github: "https://github.com/aasz253",
    linkedin: "https://www.linkedin.com/in/sifuna-codex-3238203b4/",
    image: "/my potfolio.jpg",
    whatsappText: "HI SIFUNA CODEX , I HAVE AN ISSUE"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 mt-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-widest hover:text-blue-600 transition group"
        >
          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition">
            <ArrowLeft size={20} />
          </div>
          Go Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          {/* Image Side */}
          <div className="lg:w-5/12 relative min-h-[400px]">
            <img 
              src={contactInfo.image} 
              alt={contactInfo.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h1 className="text-5xl font-black tracking-tighter mb-2">{contactInfo.name}</h1>
              <p className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                <MapPin size={20} /> {contactInfo.location}
              </p>
            </div>
          </div>

          {/* Details Side */}
          <div className="lg:w-7/12 p-10 lg:p-16 space-y-10">
            <div>
              <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mb-4">
                Full-Stack Developer & Support
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">How can I help you?</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                I'm {contactInfo.name}, the lead developer behind GasLink. Whether you're a distributor looking to grow your business or a customer with questions, I'm here to support you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl hover:bg-blue-50 transition group border-2 border-transparent hover:border-blue-100">
                <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:scale-110 transition text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                  <p className="font-black text-gray-900">{contactInfo.phone}</p>
                </div>
              </a>

              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl hover:bg-indigo-50 transition group border-2 border-transparent hover:border-indigo-100">
                <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:scale-110 transition text-indigo-600">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                  <p className="font-black text-gray-900 truncate max-w-[150px]">{contactInfo.email}</p>
                </div>
              </a>
            </div>

            {/* Social & Portfolio Links */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Digital Presence</p>
              <div className="flex flex-wrap gap-4">
                <a href={contactInfo.portfolio} target="_blank" rel="noreferrer" className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition shadow-lg shadow-gray-200">
                  <Globe size={20} /> Portfolio <ExternalLink size={16} />
                </a>
                <a href={contactInfo.github} target="_blank" rel="noreferrer" className="bg-white border-2 border-gray-100 text-gray-900 px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:border-gray-900 transition">
                  <Github size={20} /> GitHub
                </a>
                <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="bg-[#0077b5] text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#006da3] transition shadow-lg shadow-blue-100">
                  <Linkedin size={20} /> LinkedIn
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a 
              href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(contactInfo.whatsappText)}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-green-500 text-white p-8 rounded-[2.5rem] text-center font-black text-2xl hover:bg-green-600 transition shadow-2xl shadow-green-200 group"
            >
              <div className="flex items-center justify-center gap-4 transform group-hover:scale-105 transition">
                <MessageCircle size={32} />
                Chat with me on WhatsApp
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="flex flex-wrap justify-center gap-8 py-10 opacity-50">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400">
            <Code2 size={20} /> Built with Passion
          </div>
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400">
            <Rocket size={20} /> Scalable Architecture
          </div>
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400">
            <Heart size={20} className="text-red-500" /> Community Driven
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
