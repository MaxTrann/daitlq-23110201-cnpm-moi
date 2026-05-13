const LoadingState = ({ title = "Đang tải dữ liệu..." }) => {
    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                <p className="text-sm font-medium text-slate-600">{title}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
                        <div className="mt-4 h-4 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-6 h-10 animate-pulse rounded-2xl bg-slate-200" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingState;
