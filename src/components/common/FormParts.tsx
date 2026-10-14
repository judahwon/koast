export const inputClass = 'w-full rounded-lg border border-line-secondary bg-surface-primary px-4 py-3 text-content-primary transition-colors placeholder:text-content-disabled focus:border-line-focus-ring focus:outline-2 focus:outline-offset-2 focus:outline-line-focus-ring';
export const labelClass = 'mb-2 block text-sm font-medium text-content-secondary';
export const fileInputClass = 'w-full cursor-pointer rounded-lg border border-dashed border-line-secondary px-4 py-3 text-sm text-content-tertiary transition-colors file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-interactive-selected file:px-4 file:py-2 file:text-sm file:font-semibold file:text-content-interactive-primary hover:border-line-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring';
// Button.astro 의 primary/lg/pill 조합을 아일랜드에서 그대로 재현한다. 폭은 쓰는 쪽에서 정한다.
export const submitClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-interactive-primary px-7 py-3.5 text-base font-semibold text-content-interactive-inverse transition-colors hover:bg-interactive-primary-hovered focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring active:bg-interactive-primary-pressed disabled:cursor-not-allowed disabled:opacity-50';

interface FormSuccessProps {
  title: string;
  message: string;
  actionLabel: string;
  onReset: () => void;
}

export function FormSuccess({ title, message, actionLabel, onReset }: FormSuccessProps) {
  return (
    <div className={'rounded-2xl border border-line-success-subtle bg-surface-success-subtle p-10 text-center'}>
      <p className={'text-xl font-bold text-content-success-bold'}>{title}</p>
      <p className={'mt-3 text-sm text-content-secondary'}>{message}</p>
      <button
        type={'button'}
        onClick={onReset}
        className={'mt-6 rounded-full border border-line-success px-5 py-2 text-sm font-semibold text-content-success-bold transition-colors hover:bg-surface-success-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring'}
      >
        {actionLabel}
      </button>
    </div>
  );
}
