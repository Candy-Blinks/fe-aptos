import React from "react";

interface IProgressBarProps {
  steps: number;
  currentStep: number;
}

const ProgressBar: React.FC<IProgressBarProps> = ({
  steps = 5,
  currentStep = 2,
}) => {

  const clampedCurrentStep = Math.min(Math.max(currentStep, 1), steps);

  return (
    <div className="w-full relative">
      <div
        className="h-[50px] rounded-[8px] border-2 border-pink-50 p-2 transition-all duration-300 ease-in-out"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps}, 1fr)`,
          gridTemplateRows: "repeat(1, 1fr)",
          gap: "16px",
        }}
      >
        {Array.from({ length: steps }, (_, index) => {
          const isActive = index < clampedCurrentStep;
          const isLast = index === clampedCurrentStep - 1;

          return (
            <div
              key={index}
              className={`
                ${isActive ? 'bg-pink-50 shadow-md' : ''}
                ${isLast ? 'animate-pulse' : ''}
                transition-all duration-1000 ease-out rounded-[4px]
              `}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
