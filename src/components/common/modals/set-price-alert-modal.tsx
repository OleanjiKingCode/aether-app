import Modal from "react-modal";
import { RiCloseLargeLine } from "react-icons/ri";
import useDeviceWidth from "@/hooks/device-width";
import Dropdown from "../dropdown";
import { useState } from "react";

interface SetPriceAlertModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const SetPriceAlertModal = ({ isOpen, setIsOpen }: SetPriceAlertModalProps) => {
  const width = useDeviceWidth();
  const [targetPrice, setTargetPrice] = useState(0);
  const [selectedAlertType, setSelectedAlertType] = useState(0);
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

  const selectMenu = [
    "Price goes above",
    "Price falls below",
    "Price reaches exactly",
  ];

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
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <div className="text-foreground text-lg font-semibold">
                Set Price Alert for AETH
              </div>
              <div className="text-xs text-muted-foreground">
                {" "}
                Get notified when AETH reaches your target price
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground">Alert Type</div>
            <Dropdown
              data={selectMenu}
              value={selectedAlertType}
              onChange={setSelectedAlertType}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm text-foreground">Target Price ($)</div>
            <input
              className="border border-input p-2 text-sm outline-0"
              value={targetPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTargetPrice(Number(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">Current Price</div>
            <div className="text-sm text-foreground font-semibold">$2.00</div>
          </div>
          <div className="w-full flex items-end justify-between md:justify-end gap-3.5">
            <div
              className="border border-secondary flex px-4 py-2 gap-1.5 justify-center text-muted-foreground text-sm font-medium w-full md:w-fit"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </div>
            <div className="bg-primary flex px-4 py-2 gap-1.5 justify-center text-muted-foreground text-sm font-medium w-full md:w-fit">
              Create Alert
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SetPriceAlertModal;
