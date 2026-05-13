const EmptyState = ({ title = "Chưa có dữ liệu", description = "Hiện chưa có nội dung phù hợp để hiển thị." }) => {
    return (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📦
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
    );
};

export default EmptyState;
