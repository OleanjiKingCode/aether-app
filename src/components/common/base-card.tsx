
interface BaseCardProps {   
    children: React.ReactNode;
    className?: string;
}


const BaseCard = ({ children, className }: BaseCardProps) => {

    return (
        <div className={`bg-card border-[1px] border-input p-6 ${className}`}>
            {children}
        </div>
    );
}

export default BaseCard;