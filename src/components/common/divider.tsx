interface DividerProps {
    className?: string;
}

const Divider = ({className } : DividerProps) => {
    return (
        <div className={`h-px bg-input w-full ${className}`} />
    )
}

export default Divider;