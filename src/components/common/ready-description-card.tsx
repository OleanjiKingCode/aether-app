import Image from "next/image";

interface ReadyDescriptionCardProps {
    icon: string,
    title: string,
    content: string,
}

const ReadyDescriptionCard = ({ icon, title, content }: ReadyDescriptionCardProps) => {
    return (
        <div className="flex flex-col border-[1px] border-input bg-card px-4 py-5 gap-4 w-full md:min-w-100">
            <Image src={icon} width={25} height={25} alt="" />
            <div className="flex flex-col gap-1">
                <div className="text-sm text-foreground">{title}</div>
                <div className="text-xs text-muted-foreground">{content}</div>
            </div>
        </div>
    )
}

export default ReadyDescriptionCard;