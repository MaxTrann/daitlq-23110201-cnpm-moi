import { Link } from "react-router-dom";

const variantClasses = {
    primary: "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    outline: "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50",
    dark: "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:border-slate-800",
    danger: "border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
};

const baseClasses = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60";

const Button = ({ children, variant = "primary", className = "", to, href, type = "button", ...props }) => {
    const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`.trim();

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
