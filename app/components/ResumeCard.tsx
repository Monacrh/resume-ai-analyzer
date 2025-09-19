import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

// Define the Resume interface
interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  feedback: {
    overallScore: number;
  };
  imagePath: string;
}

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  
  // Always call hooks unconditionally at the top level
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        
        // Create object URL from the blob
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (error) {
        console.error("Error loading resume image:", error);
        // Fallback to a placeholder image if there's an error
        setResumeUrl('https://images.unsplash.com/photo-1549056572-75914d6d7e1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80');
      }
    };

    loadResume();

    // Clean up the object URL when component unmounts
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, [imagePath, fs, resumeUrl]);

  return (
    <div className="resume-card-container">
      <Link 
        to={`/resume/${id}`} 
        className="resume-card animate-in fade-in duration-1000"
      >
        <div className="resume-card-header">
          <div className="resume-text-container">
            {companyName && (
              <h2 className="company-name">
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <h3 className="job-title">
                {jobTitle}
              </h3>
            )}
            {!companyName && !jobTitle && (
              <h2 className="company-name">
                RESUME
              </h2>
            )}
          </div>
          <div className="score-container">
            <ScoreCircle score={feedback.overallScore} />
          </div>
        </div>
        {resumeUrl ? (
          <div className="gradient-border animate-in fade-in duration-1000">
            <div className="image-wrapper">
              <img
                src={resumeUrl}
                alt="resume"
                className="resume-image"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1549056572-75914d6d7e1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80';
                }}
              />
            </div>
          </div>
        ) : (
          <div className="gradient-border">
            <div className="image-wrapper">
              <div className="image-placeholder">
                Loading resume preview...
              </div>
            </div>
          </div>
        )}
      </Link>
      
      <style>{`
        .resume-card-container {
          margin: 15px;
          font-family: 'Courier New', monospace;
        }
        
        .resume-card {
          display: block;
          background-color: #FFF8E7;
          border: 3px solid #000000;
          box-shadow: 8px 8px 0px #000000;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          transform: translate(0, 0);
        }
        
        .resume-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px #000000;
        }
        
        .resume-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px;
          background-color: #FFD6A0;
          border-bottom: 3px solid #000000;
        }
        
        .resume-text-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        
        .company-name {
          margin: 0;
          color: #000000;
          font-weight: bold;
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.2;
        }
        
        .job-title {
          margin: 0;
          color: #000000;
          font-size: 16px;
          font-family: 'Courier New', monospace;
          line-height: 1.2;
        }
        
        .score-container {
          flex-shrink: 0;
          margin-left: 10px;
        }
        
        .gradient-border {
          border: 3px solid #000000;
          margin: 15px;
          box-shadow: 3px 3px 0px #000000;
          background-color: #f0f0f0;
        }
        
        .image-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .resume-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          object-position: top;
          display: block;
        }
        
        .image-placeholder {
          color: #666;
          font-style: italic;
          padding: 20px;
          text-align: center;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 640px) {
          .resume-image {
            height: 200px;
          }
          
          .image-placeholder {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeCard;