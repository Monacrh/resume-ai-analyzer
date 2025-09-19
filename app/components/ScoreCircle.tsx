const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  let strokeColor = '';
  if (score > 69) {
    strokeColor = '#4ade80'; // green-400
  } else if (score > 49) {
    strokeColor = '#facc15'; // yellow-400
  } else {
    strokeColor = '#f87171'; // red-400
  }

  return (
    <div className="relative w-[100px] h-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="black"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray="2 2"
        />
        {/* Partial circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
        />
      </svg>

      {/* Score and issues */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-lg font-mono">{`${score}`}</span>
        <span className="text-xs font-mono">/100</span>
      </div>
    </div>
  );
};

export default ScoreCircle;