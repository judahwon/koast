import { useState, type FormEvent } from 'react';

const INQUIRY_TYPES = [
  '프로젝트 상담',
  '솔루션 도입 문의',
  '관측장비/하드웨어 문의',
  '데이터 시각화 문의',
  '유지보수 문의',
  '기술 협력 문의',
  '채용 문의',
  '기타 문의',
];

const inputClass = 'w-full rounded-lg border border-line-secondary bg-surface-primary px-4 py-3 text-content-primary transition-colors placeholder:text-content-disabled focus:border-line-focus-ring focus:outline-2 focus:outline-offset-2 focus:outline-line-focus-ring';
const labelClass = 'mb-2 block text-sm font-medium text-content-secondary';
// Button.astro 의 primary/lg/pill 조합을 아일랜드에서 그대로 재현한다.
const submitClass = 'inline-flex w-full items-center justify-center gap-2 rounded-full bg-interactive-primary px-7 py-3.5 text-base font-semibold text-content-interactive-inverse transition-colors hover:bg-interactive-primary-hovered focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring active:bg-interactive-primary-pressed disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const file = formData.get('attachment') as File;
    if (file && file.size > 0) {
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
      <div className={'rounded-2xl border border-line-success-subtle bg-surface-success-subtle p-10 text-center'}>
        <p className={'text-xl font-bold text-content-success-bold'}>
          {'문의가 정상적으로 접수되었습니다.'}
        </p>
        <p className={'mt-3 text-sm text-content-secondary'}>
          {'확인 후 빠르게 답변드리겠습니다. 감사합니다.'}
        </p>
        <button
          type={'button'}
          onClick={() => setStatus('idle')}
          className={'mt-6 rounded-full border border-line-success px-5 py-2 text-sm font-semibold text-content-success-bold transition-colors hover:bg-surface-success-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring'}
        >
          {'추가 문의하기'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={'rounded-2xl border border-line-secondary bg-surface-primary p-6 sm:p-10'}>
      <input type={'hidden'} name={'access_key'} value={'YOUR_WEB3FORMS_ACCESS_KEY'} />
      <input type={'hidden'} name={'subject'} value={'한국해양기상기술 홈페이지 문의'} />
      <input type={'hidden'} name={'from_name'} value={'한국해양기상기술 문의'} />

      <div className={'grid gap-6 md:grid-cols-2'}>
        <div>
          <label htmlFor={'name'} className={labelClass}>
            {'이름 *'}
          </label>
          <input type={'text'} id={'name'} name={'name'} required className={inputClass} />
        </div>
        <div>
          <label htmlFor={'organization'} className={labelClass}>
            {'소속/기관명'}
          </label>
          <input type={'text'} id={'organization'} name={'organization'} className={inputClass} />
        </div>
      </div>

      <div className={'mt-6 grid gap-6 md:grid-cols-2'}>
        <div>
          <label htmlFor={'email'} className={labelClass}>
            {'이메일 *'}
          </label>
          <input type={'email'} id={'email'} name={'email'} required className={inputClass} />
        </div>
        <div>
          <label htmlFor={'phone'} className={labelClass}>
            {'연락처'}
          </label>
          <input type={'tel'} id={'phone'} name={'phone'} className={inputClass} />
        </div>
      </div>

      <div className={'mt-6'}>
        <label htmlFor={'inquiry_type'} className={labelClass}>
          {'문의 유형 *'}
        </label>
        <select id={'inquiry_type'} name={'inquiry_type'} required defaultValue={''} className={inputClass}>
          <option value={''}>{'선택해주세요'}</option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className={'mt-6'}>
        <label htmlFor={'title'} className={labelClass}>
          {'문의 제목 *'}
        </label>
        <input type={'text'} id={'title'} name={'title'} required className={inputClass} />
      </div>

      <div className={'mt-6'}>
        <label htmlFor={'message'} className={labelClass}>
          {'문의 내용 *'}
        </label>
        <textarea id={'message'} name={'message'} rows={7} required className={`${ inputClass } resize-y`} />
      </div>

      <div className={'mt-6'}>
        <label htmlFor={'attachment'} className={labelClass}>
          {'첨부파일 (5MB 이하)'}
        </label>
        <input
          type={'file'}
          id={'attachment'}
          name={'attachment'}
          className={'w-full cursor-pointer rounded-lg border border-dashed border-line-secondary px-4 py-3 text-sm text-content-tertiary transition-colors file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-interactive-selected file:px-4 file:py-2 file:text-sm file:font-semibold file:text-content-interactive-primary hover:border-line-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring'}
        />
      </div>

      <div className={'mt-8 flex items-start gap-3 rounded-lg bg-surface-subtle p-4'}>
        <input type={'checkbox'} id={'privacy'} name={'privacy'} required className={'mt-1 size-4 shrink-0 rounded-sm border-line-secondary accent-interactive-primary'} />
        <label htmlFor={'privacy'} className={'text-sm text-content-secondary'}>
          {'개인정보 수집 및 이용에 동의합니다. 문의 처리 목적 외에는 사용하지 않습니다. *'}
        </label>
      </div>

      {status === 'error' && (
        <p className={'mt-4 text-sm text-content-danger'}>{errorMessage}</p>
      )}

      <div className={'mt-8'}>
        <button
          type={'submit'}
          disabled={status === 'submitting'}
          className={submitClass}
        >
          {status === 'submitting' ? '전송 중...' : '문의 보내기'}
        </button>
      </div>
    </form>
  );
}
