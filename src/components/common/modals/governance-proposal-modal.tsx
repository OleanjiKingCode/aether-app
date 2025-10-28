import Modal from "react-modal";
import { RiCloseLargeLine } from "react-icons/ri";
import useDeviceWidth from "@/hooks/device-width";
import { useState } from "react";
import Dropdown from "../dropdown";
import BaseCard from "../base-card";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface GovernanceProposalModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const GovernanceProposalModal = ({
  isOpen,
  setIsOpen,
}: GovernanceProposalModalProps) => {
  const width = useDeviceWidth();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState(-1);
  const [voting, setVoting] = useState(1);
  const [description, setDescription] = useState("");
  const selectMenu = [
    "Protocol changes",
    "Chain Integration",
    "Treasury Management",
    "Governance Update",
  ];
  const votingMenu = ["3 days", "7 days (Recommended)", "14 days"];

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto",
      width: width > 800 ? "612px" : "calc(100% - 16px)",
      height: "fit-content",
      border: "1px solid #3F2A63",
      background: "#010314",
      padding: "0",
    },
    overlay: {
      zIndex: 99999,
      background: "#00000080",
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        document.body.classList.remove("modal-open");
      }}
      style={customModalStyles}
    >
      <div className="w-full relative p-4 md:p-6">
        <div
          className="absolute top-6 right-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <RiCloseLargeLine size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg text-foreground font-semibold">
            Submit New Proposal
          </div>
          <div className="text-sm text-muted-foreground">
            Create a governance proposal for the AetherDEX community.
          </div>
        </div>
        <div className="py-2 flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground font-medium">
              Proposal Title
            </div>
            <div className="w-full">
              <input
                className="border border-input p-2 text-sm outline-0 w-full"
                placeholder="Enter a clear, descriptive title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground font-medium">Category</div>
            <div className="w-full">
              <Dropdown
                data={selectMenu}
                value={category}
                onChange={setCategory}
                placeholder="Select category"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground font-medium">
              Description
            </div>
            <div className="w-full">
              <textarea
                className="border border-input p-2 text-sm outline-0 w-full"
                rows={7}
                minLength={50}
                maxLength={200}
                placeholder="Describe your proposal in details..."
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
              />
            </div>
            <div className="w-full flex justify-between">
              <div className="text-muted-foreground text-xs">
                50 more characters needed
              </div>
              <div className="text-muted-foreground text-xs">
                {description.length} / 200
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground font-medium">
              Voting Duration
            </div>
            <div className="w-full">
              <Dropdown data={votingMenu} value={voting} onChange={setVoting} />
            </div>
          </div>
          <BaseCard className="py-2.5 px-3 flex gap-2 items-center bg-transparent">
            <div>
              <IoMdInformationCircleOutline />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs text-foreground">Requirements</div>
              <div className="text-xs text-muted-foreground opacity-80">
                5 AETH fee required • 1,000 AETH minimum stake • 24-48h review
                period
              </div>
            </div>
          </BaseCard>
          <div className="w-full flex justify-end">
            <button className="bg-primary px-4 py-2 text-sm font-medium text-foreground">
              Submit Proposal
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GovernanceProposalModal;
