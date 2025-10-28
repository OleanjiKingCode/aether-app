interface ProgressBar {
  now: number;
  min: number;
  max: number;
  label?: string;
  striped?: boolean;
  animated?: boolean;
  color?: string;
  containerClass?: string;
}

export const Progressbar = ({
  now = 0,
  min = 0,
  max = 100,
  label = "",
  color = "bg-blue-500",
  containerClass = "",
}: ProgressBar) => {
  const progress = Math.min(
    100,
    Math.max(0, ((now - min) / (max - min)) * 100),
  );

  return (
    <div
      className={`relative h-[24px] w-full overflow-hidden rounded-[6px] border-[#d0d0d0] border-[2px] border-solid ${containerClass}`}
    >
      <div
        className={`flex h-full items-center justify-center bg-[#0b6c96] transition-all duration-300 ease-in ${color}`}
        style={{ width: `${progress}%` }}
      >
        {progress > 0 ? (
          <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-2 font-semibold text-white text-xs">
            {label}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
