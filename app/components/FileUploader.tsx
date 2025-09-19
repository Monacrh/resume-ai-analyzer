import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [dragCounter, setDragCounter] = useState(0);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setDragCounter(0);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
        onDragEnter: () => setDragCounter(prev => prev + 1),
        onDragLeave: () => setDragCounter(prev => Math.max(0, prev - 1)),
    })

    const file = acceptedFiles[0] || null;
    const hasError = fileRejections.length > 0;

    return (
        <div className="w-full h-full">
            <div 
                {...getRootProps()} 
                className={`
                    relative h-full min-h-[400px] border-4 border-black
                    ${isDragActive || dragCounter > 0 
                        ? 'bg-yellow-300 shadow-[8px_8px_0px_#ff0000] border-red-500' 
                        : file 
                            ? 'bg-green-300 shadow-[8px_8px_0px_#00ff00]' 
                            : hasError
                                ? 'bg-red-300 shadow-[8px_8px_0px_#ff0000]'
                                : 'bg-purple-300 shadow-[8px_8px_0px_#0000ff] hover:bg-purple-200'
                    }
                    cursor-pointer transition-all duration-200 hover:shadow-[12px_12px_0px_#0000ff]
                    hover:translate-x-[-2px] hover:translate-y-[-2px]
                    font-mono uppercase font-black
                `}
            >
                <input {...getInputProps()} />
                
                {/* Retro grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" 
                     style={{
                         backgroundImage: `
                             linear-gradient(90deg, black 1px, transparent 1px),
                             linear-gradient(black 1px, transparent 1px)
                         `,
                         backgroundSize: '20px 20px'
                     }} 
                />

                <div className="relative z-10 h-full flex flex-col justify-center items-center p-6">
                    {file ? (
                        <div className="w-full space-y-6" onClick={(e) => e.stopPropagation()}>
                            {/* Success header */}
                            <div className="text-center">
                                <div className="text-4xl font-black text-black mb-2">
                                    ✓ FILE LOADED
                                </div>
                                <div className="h-2 bg-black"></div>
                            </div>
                            
                            {/* File info box */}
                            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-red-500 border-2 border-black flex items-center justify-center">
                                            <span className="text-white font-black text-xl">PDF</span>
                                        </div>
                                        <div>
                                            <p className="text-black font-bold text-lg truncate max-w-[200px]">
                                                {file.name}
                                            </p>
                                            <p className="text-black font-bold">
                                                SIZE: {formatSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        className="w-10 h-10 bg-red-500 border-2 border-black text-white font-black text-xl
                                                 hover:bg-red-600 transition-colors duration-200 flex items-center justify-center" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onFileSelect?.(null);
                                        }}
                                        title="REMOVE FILE"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            
                            {/* Replace button */}
                            <div className="text-center">
                                <div className="bg-black text-white px-4 py-2 font-bold">
                                    CLICK TO REPLACE FILE
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6">
                            {/* Upload icon */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto
                                             border-4 border-white shadow-[4px_4px_0px_#ffffff]">
                                    <span className="text-4xl font-black">↑</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 border-2 border-black
                                             flex items-center justify-center rotate-12">
                                    <span className="text-black font-black text-lg">!</span>
                                </div>
                            </div>
                            
                            {/* Main text */}
                            <div className="space-y-3">
                                <div className="text-3xl font-black text-black">
                                    DROP FILE HERE
                                </div>
                                <div className="h-2 bg-black w-32 mx-auto"></div>
                                <div className="text-xl font-bold text-black">
                                    OR CLICK TO BROWSE
                                </div>
                            </div>
                            
                            {/* File requirements box */}
                            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000000] p-4 mx-auto max-w-xs">
                                <div className="text-black font-bold space-y-1">
                                    <div>FORMAT: PDF ONLY</div>
                                    <div>MAX SIZE: {formatSize(maxFileSize)}</div>
                                </div>
                            </div>
                            
                            {hasError && (
                                <div className="bg-red-500 border-4 border-black text-white p-3 font-bold">
                                    ERROR: {fileRejections[0]?.errors[0]?.message || 'INVALID FILE'}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Animated border effect */}
                    {(isDragActive || dragCounter > 0) && (
                        <div className="absolute inset-0 border-4 border-dashed border-red-500 animate-pulse pointer-events-none">
                            <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 animate-bounce"></div>
                            <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 animate-bounce delay-100"></div>
                            <div className="absolute bottom-2 left-2 w-4 h-4 bg-red-500 animate-bounce delay-200"></div>
                            <div className="absolute bottom-2 right-2 w-4 h-4 bg-red-500 animate-bounce delay-300"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader