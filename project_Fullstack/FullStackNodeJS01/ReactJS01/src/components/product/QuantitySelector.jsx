const QuantitySelector = ({ value, onChange, max = 0, disabled = false }) => {
    const safeMax = Math.max(max, 1);

    const updateQuantity = (nextValue) => {
        const clamped = Math.max(1, Math.min(nextValue, safeMax));
        onChange(clamped);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => updateQuantity(value - 1)}
                disabled={disabled || value <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                -
            </button>
            <div className="flex h-11 min-w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900">
                {value}
            </div>
            <button
                onClick={() => updateQuantity(value + 1)}
                disabled={disabled || value >= max}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
