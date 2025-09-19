import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 font-mono flex items-center justify-center p-6">
            {/* Retro grid pattern overlay */}
            <div className="absolute inset-0 opacity-5" 
                 style={{
                     backgroundImage: `
                         linear-gradient(90deg, black 1px, transparent 1px),
                         linear-gradient(black 1px, transparent 1px)
                     `,
                     backgroundSize: '30px 30px'
                 }} 
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-yellow-300 border-4 border-black shadow-[12px_12px_0px_#000000] p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto
                                     border-4 border-white shadow-[4px_4px_0px_#ffffff]">
                            <span className="text-3xl font-black">🔐</span>
                        </div>
                        
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-black uppercase tracking-tight">
                                WELCOME BACK
                            </h1>
                            <div className="h-2 bg-black w-32 mx-auto"></div>
                            <h2 className="text-xl font-bold text-black uppercase">
                                LOG IN TO CONTINUE YOUR JOB JOURNEY
                            </h2>
                        </div>
                    </div>

                    {/* Auth Button */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="bg-gray-400 border-4 border-black text-black font-black text-xl py-6 px-8 
                                         uppercase tracking-wide text-center shadow-[6px_6px_0px_#000000]">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="flex space-x-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div 
                                                key={i}
                                                className="w-2 h-2 bg-black animate-pulse"
                                                style={{animationDelay: `${i * 200}ms`}}
                                            ></div>
                                        ))}
                                    </div>
                                    <span>SIGNING YOU IN...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button 
                                        className="w-full bg-red-400 border-4 border-black text-black font-black text-xl py-6 px-8 
                                                 uppercase tracking-wide shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000]
                                                 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                                                 hover:bg-red-300" 
                                        onClick={auth.signOut}
                                    >
                                        🚪 LOG OUT
                                    </button>
                                ) : (
                                    <button 
                                        className="w-full bg-green-400 border-4 border-black text-black font-black text-xl py-6 px-8 
                                                 uppercase tracking-wide shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000]
                                                 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                                                 hover:bg-green-300" 
                                        onClick={auth.signIn}
                                    >
                                        🔑 LOG IN
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-6 space-y-4">
                        <h3 className="font-black text-lg text-black uppercase text-center">
                            ⚡ QUICK ACCESS
                        </h3>
                        <div className="space-y-2 text-black font-bold text-center">
                            <div>• UPLOAD & ANALYZE RESUMES</div>
                            <div>• GET AI-POWERED FEEDBACK</div>
                            <div>• TRACK YOUR APPLICATIONS</div>
                            <div>• IMPROVE YOUR ATS SCORE</div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-300 border-4 border-black shadow-[4px_4px_0px_#000000] p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black">
                                !
                            </div>
                            <div className="text-black font-bold text-sm">
                                SECURE LOGIN POWERED BY PUTER
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 border-2 border-black rotate-12"></div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-yellow-400 border-2 border-black -rotate-12"></div>
                <div className="absolute -bottom-3 -left-2 w-4 h-4 bg-green-400 border-2 border-black rotate-45"></div>
                <div className="absolute -bottom-4 -right-4 w-10 h-4 bg-purple-400 border-2 border-black"></div>
            </div>
        </main>
    )
}

export default Auth