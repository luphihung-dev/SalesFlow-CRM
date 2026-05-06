export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-moss">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
