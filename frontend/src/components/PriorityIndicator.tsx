export default function PriorityIndicator({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-red-500' : score >= 50 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${color}`}
      title={`Priority Score: ${score}`}
    ></span>
  );
}
