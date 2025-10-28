interface BarProps {
    barClassName?: string
}

const Bar = ({ barClassName }: BarProps) => {
    return (
        <div role="status" className="animate-pulse">
            <div className={`skeleton-bg rounded-full ${barClassName}`}> </div>
        </div>
    )
}

export default Bar