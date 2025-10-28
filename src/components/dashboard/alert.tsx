import { IoMdArrowUp } from "react-icons/io";
import { IoMdArrowDown } from "react-icons/io";
import Bar from "../common/skeleton/bar";

interface AlertProps {
    status: Status,
    name: string,
    value: string,
    rate: string,
    isLoading?: boolean

}

enum Status {
    Up = 1, Down = 2
}
const Alert = ({ status, name, value, rate, isLoading }: AlertProps) => {
    return (
        <div className={`${status === 1 ? (isLoading ? 'opacity-20 bg-green-900' : 'bg-green-900') : (isLoading ? 'opacity-20 bg-red-900' : 'bg-red-900')} px-4 py-2 flex justify-between items-center`}>
            <div className="flex flex-col gap-1">
                {isLoading === true && (<Bar barClassName="w-full min-w-50 h-3" />)}

                {!isLoading && (<div className="text-xs text-muted-foreground font-geist-mono font-normal">
                    {name}
                </div>)}
                {isLoading === true && (<Bar barClassName="w-full min-w-50 h-3" />)}

                {!isLoading && (<div className=" text-sm font-geist-mono font-normal text-foreground">
                    {value}
                </div>)}
            </div>

            <div className="flex gap-1">
                {isLoading === true && (<Bar barClassName="w-3 h-3" />)}
                {!isLoading && (status == 1 ? <IoMdArrowUp size={20} color="#00a63e" /> : <IoMdArrowDown size={20} color="#e7000b" />)}

                {isLoading === true && (<Bar barClassName="w-9.5 h-3" />)}
                {!isLoading && (<div className={`${status === 1 ? 'text-green-600' : 'text-red-600'} text-sm font-geist-mono font-normal`}>{rate}</div>)}
            </div>
        </div>
    )
}

export default Alert;