const badgeClasses = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200"
};

const StatusBadge = ({ children, tone = "neutral" }) => {
    return (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[tone] || badgeClasses.neutral}`}>
            {children}
        </span>
    );
};

export default StatusBadge;
