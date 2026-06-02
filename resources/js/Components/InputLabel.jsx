export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`form-label fw-semibold text-secondary ` + className}
        >
            {value ? value : children}
        </label>
    );
}
