import Bar from "./skeleton/bar";

interface SwitchButtonProps {
  value: number;
  setValue: (val: number) => void;
  isLoading?: boolean;
  firstOptionName: string;
  firstOptionIcon?: React.ReactNode;
  secondOptionName: string;
  secondOptionIcon?: React.ReactNode;
  containerClass?: string;
}

const SwitchButton = ({
  containerClass,
  value,
  setValue,
  isLoading,
  firstOptionName,
  firstOptionIcon,
  secondOptionName,
  secondOptionIcon,
}: SwitchButtonProps) => {
  const handleSwitch = (val: number) => {
    if (!isLoading) {
      setValue(val);
    }
  };

  return (
    <div
      className={`border-[1px] border-input p-1 gap-2 flex w-fit ${containerClass}`}
    >
      <div
        className={`py-1.5 px-3 flex-1 cursor-pointer ${
          value === 1 ? "bg-secondary text-background" : "text-muted-foreground"
        }`}
        onClick={() => handleSwitch(1)}
      >
        {isLoading && <Bar barClassName="w-8 h-3" />}
        {!isLoading && (
          <div className="flex gap-2 items-center justify-center">
            {firstOptionIcon && (
              <div className="w-4 h-4">{firstOptionIcon}</div>
            )}
            <div className="text-sm">{firstOptionName}</div>
          </div>
        )}
      </div>
      <div
        className={`py-1.5 px-3 flex-1 cursor-pointer ${
          value === 2 ? "bg-secondary text-background" : "text-muted-foreground"
        }`}
        onClick={() => handleSwitch(2)}
      >
        {isLoading && <Bar barClassName="w-8 h-3" />}
        {!isLoading && (
          <div className="flex gap-2 items-center justify-center">
            {secondOptionIcon && (
              <div className="w-4 h-4">{secondOptionIcon}</div>
            )}
            <div className="text-sm">{secondOptionName}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchButton;
