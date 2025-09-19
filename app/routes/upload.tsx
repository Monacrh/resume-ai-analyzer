import {type FormEvent, useState, useEffect} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [glitchText, setGlitchText] = useState('RESUMELY');
    const [processingStep, setProcessingStep] = useState(0);

    // Glitch effect for title
    useEffect(() => {
        if (!isProcessing) {
            const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
            const originalText = 'RESUMELY';
            const interval = setInterval(() => {
                if (Math.random() > 0.8) {
                    const glitched = originalText
                        .split('')
                        .map(char => Math.random() > 0.9 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
                        .join('');
                    setGlitchText(glitched);
                    setTimeout(() => setGlitchText(originalText), 100);
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const processingSteps = [
        'UPLOADING FILE...',
        'CONVERTING TO IMAGE...',
        'UPLOADING IMAGE...',
        'PREPARING DATA...',
        'ANALYZING RESUME...',
        'GENERATING FEEDBACK...',
        'FINALIZING RESULTS...'
    ];

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        setProcessingStep(0);

        setStatusText(processingSteps[0]);
        setProcessingStep(1);
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('ERROR: FAILED TO UPLOAD FILE');

        setStatusText(processingSteps[1]);
        setProcessingStep(2);
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('ERROR: FAILED TO CONVERT PDF TO IMAGE');

        setStatusText(processingSteps[2]);
        setProcessingStep(3);
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('ERROR: FAILED TO UPLOAD IMAGE');

        setStatusText(processingSteps[3]);
        setProcessingStep(4);
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText(processingSteps[4]);
        setProcessingStep(5);

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('ERROR: FAILED TO ANALYZE RESUME');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        setStatusText(processingSteps[5]);
        setProcessingStep(6);
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        
        setStatusText(processingSteps[6]);
        setProcessingStep(7);
        console.log(data);
        
        setTimeout(() => {
            navigate(`/resume/${uuid}`);
        }, 1000);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    const isFormValid = file && true; // Add more validation as needed

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 font-mono">
            <Navbar />

            <section className="container mx-auto px-6 py-8">
                {/* Main Title with glitch effect */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black text-black mb-4 tracking-tight">
                        {glitchText}
                    </h1>
                    <div className="h-3 bg-black w-96 mx-auto mb-6"></div>
                    {isProcessing ? (
                        <div className="space-y-6">
                            <div className="bg-black text-green-400 p-6 border-4 border-green-400 shadow-[8px_8px_0px_#00ff00] max-w-2xl mx-auto">
                                <div className="text-2xl font-bold mb-4">{statusText}</div>
                                
                                {/* Progress bar */}
                                <div className="w-full bg-green-900 h-6 border-2 border-green-400">
                                    <div 
                                        className="bg-green-400 h-full transition-all duration-500 ease-out"
                                        style={{width: `${(processingStep / processingSteps.length) * 100}%`}}
                                    ></div>
                                </div>
                                
                                {/* Processing animation */}
                                <div className="mt-4 text-lg">
                                    {'> '}{Array.from({length: processingStep}, (_, i) => '█').join('')}
                                    <span className="animate-pulse">{'█'.repeat(3)}</span>
                                </div>
                            </div>
                            
                            {/* Retro loading animation */}
                            <div className="flex justify-center space-x-2">
                                {[...Array(8)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="w-4 h-4 bg-black border-2 border-white animate-pulse"
                                        style={{animationDelay: `${i * 200}ms`}}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-3xl font-bold text-black">
                            GET AI-POWERED FEEDBACK FOR YOUR DREAM JOB!
                        </h2>
                    )}
                </div>

                {!isProcessing && (
                    <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
                        {/* Left side - Form */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_#000000] p-8 w-full">
                                <h3 className="text-2xl font-black text-black mb-6 uppercase">
                                    📋 JOB DETAILS
                                </h3>
                                
                                <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <label 
                                            htmlFor="company-name" 
                                            className="block text-black font-bold text-lg uppercase tracking-wide"
                                        >
                                            🏢 COMPANY NAME
                                        </label>
                                        <input 
                                            type="text" 
                                            name="company-name" 
                                            placeholder="ENTER COMPANY NAME" 
                                            id="company-name" 
                                            className="w-full min-w-[600px] p-4 border-4 border-black bg-white text-black font-bold text-lg
                                                     placeholder-gray-600 focus:bg-cyan-100 focus:outline-none
                                                     shadow-[4px_4px_0px_#000000] focus:shadow-[6px_6px_0px_#000000]
                                                     transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label 
                                            htmlFor="job-title" 
                                            className="block text-black font-bold text-lg uppercase tracking-wide"
                                        >
                                            👔 JOB TITLE
                                        </label>
                                        <input 
                                            type="text" 
                                            name="job-title" 
                                            placeholder="ENTER JOB TITLE" 
                                            id="job-title" 
                                            className="w-full min-w-[600px] p-4 border-4 border-black bg-white text-black font-bold text-lg
                                                     placeholder-gray-600 focus:bg-cyan-100 focus:outline-none
                                                     shadow-[4px_4px_0px_#000000] focus:shadow-[6px_6px_0px_#000000]
                                                     transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label 
                                            htmlFor="job-description" 
                                            className="block text-black font-bold text-lg uppercase tracking-wide"
                                        >
                                            📝 JOB DESCRIPTION
                                        </label>
                                        <textarea 
                                            rows={6} 
                                            name="job-description" 
                                            placeholder="PASTE THE COMPLETE JOB DESCRIPTION HERE..." 
                                            id="job-description" 
                                            className="w-full min-w-[600px] p-4 border-4 border-black bg-white text-black font-bold text-lg
                                                     placeholder-gray-600 focus:bg-cyan-100 focus:outline-none resize-none
                                                     shadow-[4px_4px_0px_#000000] focus:shadow-[6px_6px_0px_#000000]
                                                     transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Submit button */}
                            <button 
                                form="upload-form"
                                type="submit" 
                                disabled={!isFormValid}
                                className={`
                                    w-full text-2xl font-black py-6 px-8 border-4 border-black uppercase tracking-wide
                                    transition-all duration-200 shadow-[8px_8px_0px_#000000]
                                    ${isFormValid 
                                        ? 'bg-green-400 text-black hover:bg-green-300 hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer' 
                                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    }
                                `}
                            >
                                {isFormValid ? '🚀 ANALYZE MY RESUME!' : '⚠️ COMPLETE ALL FIELDS'}
                            </button>

                            {/* Info box */}
                            <div className="bg-blue-300 border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                <h4 className="font-black text-lg text-black mb-3">💡 HOW IT WORKS:</h4>
                                <ul className="space-y-2 text-black font-bold">
                                    <li>• UPLOAD YOUR RESUME (PDF ONLY)</li>
                                    <li>• ENTER JOB DETAILS</li>
                                    <li>• GET AI-POWERED ATS SCORE</li>
                                    <li>• RECEIVE IMPROVEMENT TIPS</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right side - File Uploader */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-2">
                                <h3 className="text-2xl font-black text-black mb-4 bg-red-400 p-4 border-2 border-black uppercase text-center">
                                    📄 UPLOAD RESUME
                                </h3>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            {/* Tips section */}
                            <div className="bg-orange-300 border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                <h4 className="font-black text-lg text-black mb-4">🔥 PRO TIPS:</h4>
                                <div className="space-y-3 text-black font-bold">
                                    <div className="bg-white border-2 border-black p-3">
                                        ✓ USE UPDATED RESUME FORMAT
                                    </div>
                                    <div className="bg-white border-2 border-black p-3">
                                        ✓ INCLUDE RELEVANT KEYWORDS
                                    </div>
                                    <div className="bg-white border-2 border-black p-3">
                                        ✓ MATCH JOB REQUIREMENTS
                                    </div>
                                    <div className="bg-white border-2 border-black p-3">
                                        ✓ CLEAR & READABLE FORMAT
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Upload