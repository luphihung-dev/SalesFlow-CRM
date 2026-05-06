import { statusTone } from '../utils/constants';

export default function Badge({ children, tone }) {
  const classes = statusTone[tone || children] || 'bg-fog text-ink border-stone-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}>
      {children}
    </span>
  );
}
