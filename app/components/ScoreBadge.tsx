interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';

  if (score > 70) {
    badgeColor = 'bg-green-300';
    badgeText = 'Strong';
  } else if (score > 49) {
    badgeColor = 'bg-yellow-300';
    badgeText = 'Good Start';
  } else {
    badgeColor = 'bg-red-300';
    badgeText = 'Needs Work';
  }

  return (
    <div className={`px-3 py-1 border-2 border-black rounded-md ${badgeColor}`}>
      <p className="text-sm font-bold font-mono text-black">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;