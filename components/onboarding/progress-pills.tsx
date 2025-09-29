interface ProgressPillsProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressPills({ currentStep, totalSteps }: ProgressPillsProps) {
  return (
    <div className="flex gap-2.5 w-full" style={{ height: '15px' }}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className="flex-1 h-full rounded-full border-solid"
          style={{
            borderTopWidth: '1px',
            borderRightWidth: '2px',
            borderBottomWidth: '2px',
            borderLeftWidth: '1px',
            backgroundColor: index < currentStep ? '#FECAEB' : 'var(--secondary-bg)',
            borderColor: index < currentStep ? 'var(--primary-on-primary)' : 'var(--fg-solid)',
          }}
        />
      ))}
    </div>
  );
} 