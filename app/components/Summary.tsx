import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-800'
            : score > 49
        ? 'text-yellow-800' : 'text-red-800';

    return (
        <div className="p-4 border-t-2 border-black flex justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
                <p className="text-2xl font-mono">{title}</p>
                <ScoreBadge score={score} />
            </div>
            <p className="text-2xl font-mono">
                <span className={textColor}>{score}</span>/100
            </p>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_#000] w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold font-mono">Your Resume Score</h2>
                    <p className="text-sm text-gray-600">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    )
}
export default Summary