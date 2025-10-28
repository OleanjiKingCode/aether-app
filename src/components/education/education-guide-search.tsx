import { useEffect, useState } from "react"
import EducationGuideCard from "./education-guide-card"
import Bar from "../common/skeleton/bar";


interface EducationGuideSearchProps {
    keyword?: string,
    setKeyword: (keyword: any) => void,
    category: number,
    setCategory: (category: number) => void,
}

const EducationGuideSearch = ({ keyword, setKeyword, category, setCategory }: EducationGuideSearchProps) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    })

    const searchCategroy = [
        {
            name: 'All topics',
            number: 25
        },
        {
            name: 'AI Tokens',
            number: 7
        },
        {
            name: 'DePIN',
            number: 4
        },
        {
            name: 'Privacy',
            number: 5
        },
        {
            name: 'Cross-chain',
            number: 7
        },

    ]

    return (
        <div className="flex gap-6 flex-col xl:flex-row">
            <div className="relative w-full xl:w-[577px]">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-4.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                </span>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search guides and tutorials..."
                    className="border border-input pl-8 px-3.5 py-2.5 text-base bg-muted focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
            </div>
            <div className="grid grid-cols-3 xl:flex gap-3">
                {searchCategroy.map((category, index) => {
                    return (
                        <button className="flex items-center justify-center gap-2 px-3 py-2.5 border border-border text-xs text-muted-foreground cursor-pointer bg-muted" onClick={() => setCategory(index)}>
                            {isLoading && <Bar barClassName="w-10 h-3" />}
                            {!isLoading && category.name}

                            <div className="flex items-center justify-center bg-primary text-xs text-muted-foreground w-[23px] h-5">
                                {isLoading && <Bar barClassName="w-3 h-3" />}
                                {!isLoading && category.number}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default EducationGuideSearch;