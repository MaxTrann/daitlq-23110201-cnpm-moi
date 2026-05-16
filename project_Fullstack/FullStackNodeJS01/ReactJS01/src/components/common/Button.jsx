import { Link } from "react-router-dom";

const variantClasses = {
    primary: "border border-[#0067b8] bg-[#0067b8] text-white hover:bg-[#005299] hover:border-[#005299]",
    secondary: "border border-[#ddd] bg-white text-[#333] hover:bg-[#f4f6f8]",
    outline: "border border-[#0067b8] bg-white text-[#0067b8] hover:bg-[#e8f4fc]",
    dark: "border border-[#004a85] bg-[#004a85] text-white hover:bg-[#003366]",
    danger: "border border-[#e31e24] bg-[#e31e24] text-white hover:bg-[#c41920]"
};

const baseClasses = "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#0067b8]/30 disabled:cursor-not-allowed disabled:opacity-60";

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
