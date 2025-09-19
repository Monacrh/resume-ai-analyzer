import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  // const [glitchText, setGlitchText] = useState('RESUMELY');

  // Glitch effect for title
  // useEffect(() => {
  //   if (!loadingResumes) {
  //     const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  //     const originalText = 'RESUMELY';
  //     const interval = setInterval(() => {
  //       if (Math.random() > 0.8) {
  //         const glitched = originalText
  //           .split('')
  //           .map(char => Math.random() > 0.9 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
  //           .join('');
  //         setGlitchText(glitched);
  //         setTimeout(() => setGlitchText(originalText), 100);
  //       }
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // }, [loadingResumes]);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value)
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 font-mono">
      <Navbar />

      <section className="container mx-auto px-6 py-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-4 tracking-tight">
            {/* {glitchText} */}
          </h1>
          {/* <div className="h-3 bg-black w-96 mx-auto mb-6"></div> */}
          
          {!loadingResumes && resumes?.length === 0 ? (
            <div className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_#000000] p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-black uppercase">
                NO RESUMES FOUND. UPLOAD YOUR FIRST RESUME TO GET FEEDBACK.
              </h2>
            </div>
          ) : (
            <div className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_#000000] p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-black uppercase">
                REVIEW YOUR SUBMISSIONS AND CHECK AI-POWERED FEEDBACK.
              </h2>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="bg-black text-green-400 p-8 border-4 border-green-400 shadow-[8px_8px_0px_#00ff00] max-w-lg mx-auto">
              <div className="text-2xl font-bold text-center mb-4">LOADING RESUMES...</div>
              <div className="flex justify-center space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-4 h-4 bg-green-400 border-2 border-white animate-pulse"
                    style={{animationDelay: `${i * 200}ms`}}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resume Cards */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}  


        {/* No Resumes - Upload Button */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 space-y-8">
            <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_#000000] p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <div className="text-2xl font-black text-black mb-4">GET STARTED NOW!</div>
              <div className="text-lg font-bold text-black">UPLOAD YOUR RESUME TO GET AI-POWERED FEEDBACK</div>
            </div>
            
            <Link 
              to="/upload" 
              className="bg-green-400 border-4 border-black text-black font-black text-2xl py-6 px-12 
                       uppercase tracking-wide shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000]
                       hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                       hover:bg-green-300"
            >
              🚀 UPLOAD RESUME
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}