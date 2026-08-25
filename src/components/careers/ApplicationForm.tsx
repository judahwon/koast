import { useState, type FormEvent } from 'react';

interface Props {
  jobTitle: string;
  jobSlug: string;
}

export default function ApplicationForm({ jobTitle, jobSlug }: Props) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // File validation
    const file = formData.get('resume') as File;
    if (file && file.size > 0) {
      if (!file.name.endsWith('.pdf')) {
        setErrorMessage('PDF 파일만 업로드 가능합니다.');
        setStatus('error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('파일 크기는 5MB 이하만 가능합니다.');
        setStatus('error');
        return;
      }
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setErrorMessage('전송에 실패했습니다. 다시 시도해주세요.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        className={
          'rounded-xl bg-surface-success-subtle p-8 text-center'
        }
      >
        <p
          className={'text-lg font-semibold text-content-success-bold'}
        >
          {'지원서가 정상적으로 접수되었습니다.\r'}
        </p>
        <p className={'mt-2 text-sm text-content-success'}>
          {'검토 후 안내드리겠습니다. 감사합니다.\r'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className={
            'mt-4 text-sm text-content-success underline'
          }
        >
          {'추가 지원하기\r'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={'space-y-5'}>
      {/* Web3Forms config */}
      <input
        type={'hidden'}
        name={'access_key'}
        value={'YOUR_WEB3FORMS_ACCESS_KEY'}
      />
      <input
        type={'hidden'}
        name={'subject'}
        value={`채용 지원: ${ jobTitle }`}
      />
      <input
        type={'hidden'}
        name={'from_name'}
        value={'한국해양기상기술 채용'}
      />
      <input type={'hidden'} name={'job_slug'} value={jobSlug} />

      <div className={'grid gap-5 md:grid-cols-2'}>
        <div>
          <label
            htmlFor={'name'}
            className={
              'mb-1 block text-sm font-medium text-content-secondary'
            }
          >
            {'이름 *\r'}
          </label>
          <input
            type={'text'}
            id={'name'}
            name={'name'}
            required
            className={
              'w-full rounded-lg border border-line-primary bg-surface-primary px-4 py-2.5 text-content-primary transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-line-focus-ring'
            }
          />
        </div>
        <div>
          <label
            htmlFor={'email'}
            className={
              'mb-1 block text-sm font-medium text-content-secondary'
            }
          >
            {'이메일 *\r'}
          </label>
          <input
            type={'email'}
            id={'email'}
            name={'email'}
            required
            className={
              'w-full rounded-lg border border-line-primary bg-surface-primary px-4 py-2.5 text-content-primary transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-line-focus-ring'
            }
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={'phone'}
          className={
            'mb-1 block text-sm font-medium text-content-secondary'
          }
        >
          {'연락처\r'}
        </label>
        <input
          type={'tel'}
          id={'phone'}
          name={'phone'}
          className={
            'w-full rounded-lg border border-line-primary bg-surface-primary px-4 py-2.5 text-content-primary transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-line-focus-ring'
          }
        />
      </div>

      <div>
        <label
          htmlFor={'message'}
          className={
            'mb-1 block text-sm font-medium text-content-secondary'
          }
        >
          {'자기소개 / 지원 동기\r'}
        </label>
        <textarea
          id={'message'}
          name={'message'}
          rows={4}
          className={
            'w-full resize-y rounded-lg border border-line-primary bg-surface-primary px-4 py-2.5 text-content-primary transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-line-focus-ring'
          }
        />
      </div>

      <div>
        <label
          htmlFor={'resume'}
          className={
            'mb-1 block text-sm font-medium text-content-secondary'
          }
        >
          {'이력서 (PDF, 5MB 이하) *\r'}
        </label>
        <input
          type={'file'}
          id={'resume'}
          name={'resume'}
          accept={'.pdf'}
          required
          className={
            'w-full text-sm text-content-tertiary file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface-info-subtle file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-interactive-primary file:transition-colors hover:file:bg-interactive-selected-hovered'
          }
        />
      </div>

      {status === 'error' && (
        <p className={'text-sm text-content-danger'}>
          {errorMessage}
        </p>
      )}

      <button
        type={'submit'}
        disabled={status === 'submitting'}
        className={
          'w-full rounded-lg bg-interactive-primary px-6 py-3 font-medium text-content-interactive-inverse transition-colors hover:bg-interactive-primary-hovered active:bg-interactive-primary-pressed disabled:cursor-not-allowed disabled:opacity-50'
        }
      >
        {status === 'submitting' ? '전송 중...' : '지원하기'}
      </button>
    </form>
  );
}
