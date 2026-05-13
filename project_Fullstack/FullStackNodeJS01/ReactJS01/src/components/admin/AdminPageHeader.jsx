const AdminPageHeader = ({ title, description, extra }) => {
    return (
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
            </div>
            {extra && <div className="flex flex-wrap items-center gap-3">{extra}</div>}
        </div>
    );
};

export default AdminPageHeader;
