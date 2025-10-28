import Image from "next/image";


interface BadgeProps {
    icon?: string,
    badgeClassName?: string,
    title: string
}

const Badge = ({ icon, badgeClassName, title }: BadgeProps) => {
    return (
        <div className={`flex p-1 gap-1 text-xs text-muted-foreground bg-card border-[1px] border-input ${badgeClassName}`}>
            {icon && (<Image src={icon} width={14} height={14} alt="badge" />) }
            {title}
        </div>
    )
}

export default Badge;