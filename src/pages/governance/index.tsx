import ReadyToStart from "@/components/governance/ready-to-start"
import Image from "next/image"
import { useWalletContext } from "@/context/WalletContext"
import UserNoteIcon from "public/icon/governance/user-note-icon.svg"
import { useState } from "react"
import GovernanceProposalModal from "@/components/common/modals/governance-proposal-modal"
import GovernanceMainSection from "@/components/governance/governance-main-section"

const Governance = () => {
    const { isConnected } = useWalletContext()
    const [isShowProposalModal, setIsShowProposalModal] = useState(false)
    const handleShowProposalModal = () => {
        if (!isConnected) return;
        setIsShowProposalModal(true)

    }
    return (
        <div className="ml-0 sm:ml-50">
            <div className="flex xl:items-center flex-col gap-1 xl:flex-row justify-between px-6 md:px-8 py-4.5 border-y-[1px] border-input">
                <div className="flex flex-col gap-y-1.5">
                    <b className="text-foreground">Governance</b>
                    <p className="text-muted-foreground text-xs h-11 w-full xl:w-175 md:h-10 md:text-sm">
                        Engage in protocol decisions to influence the future of AetherDEX while earning rewards.
                    </p>
                </div>
                <div>
                    <button className={`gradient-bg text-xs font-semibold text-white px-4 py-[9px] cursor-pointer flex gap-1 ${isConnected ? '' : 'opacity-50'}`} onClick={handleShowProposalModal}>
                        <Image src={UserNoteIcon} width={16} height={16} alt="" />
                        Submit Proposal
                    </button>
                </div>
            </div>
            <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
                {!isConnected && (
                    <ReadyToStart />
                )}
                {isConnected && (
                    <GovernanceMainSection />
                )}
                <GovernanceProposalModal isOpen={isShowProposalModal} setIsOpen={setIsShowProposalModal} />
            </div>
        </div>
    )
}

export default Governance;