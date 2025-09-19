import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 font-mono">
            {/* Navigation */}
            <nav className="bg-yellow-300 border-b-4 border-black shadow-[0px_4px_0px_#000000] p-4">
                <div className="container mx-auto">
                    <Link 
                        to="/" 
                        className="inline-flex items-center space-x-3 bg-white border-4 border-black 
                                 shadow-[4px_4px_0px_#000000] px-6 py-3 hover:shadow-[6px_6px_0px_#000000]
                                 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200
                                 font-black text-black uppercase"
                    >
                        <span className="text-2xl">←</span>
                        <span>BACK TO HOMEPAGE</span>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    {/* Left side - Resume Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-2">
                            <h3 className="text-2xl font-black text-black mb-4 bg-blue-400 p-4 border-2 border-black uppercase text-center">
                                📄 RESUME PREVIEW
                            </h3>
                            
                            {imageUrl && resumeUrl ? (
                                <div className="border-4 border-black bg-gray-100 min-h-[600px] flex items-center justify-center">
                                    <a 
                                        href={resumeUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block w-full h-full hover:scale-105 transition-transform duration-200"
                                    >
                                        <img
                                            src={imageUrl}
                                            className="w-full h-full object-contain"
                                            alt="Resume Preview"
                                        />
                                    </a>
                                </div>
                            ) : (
                                <div className="border-4 border-black bg-gray-100 min-h-[600px] flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="text-4xl font-black">⏳</div>
                                        <div className="text-xl font-bold text-black">LOADING RESUME...</div>
                                        <div className="flex justify-center space-x-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div 
                                                    key={i}
                                                    className="w-3 h-3 bg-black animate-pulse"
                                                    style={{animationDelay: `${i * 200}ms`}}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - Feedback */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-green-300 border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
                            <h2 className="text-4xl font-black text-black mb-6 uppercase text-center">
                                📊 RESUME REVIEW
                            </h2>
                            <div className="h-2 bg-black w-full mb-6"></div>
                            
                            {feedback ? (
                                <div className="space-y-8">
                                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                        <Summary feedback={feedback} />
                                    </div>
                                    
                                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                    </div>
                                    
                                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                        <Details feedback={feedback} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="bg-black text-green-400 p-8 border-4 border-green-400 shadow-[4px_4px_0px_#00ff00]">
                                        <div className="text-2xl font-bold mb-4">ANALYZING RESUME...</div>
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
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Resume