const SectionHeader = ({ eyebrow, title, description, action }) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                {eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                        {eyebrow}
                    </p>
                )}
                {title && <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h2>}
                {description && <p className="max-w-2xl text-sm leading-7 text-slate-500">{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};

export default SectionHeader;
