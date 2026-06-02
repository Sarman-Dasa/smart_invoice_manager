export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`btn btn-primary ${disabled ? 'disabled' : ''} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
