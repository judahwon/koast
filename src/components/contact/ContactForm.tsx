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

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // File validation
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
      <div className={'rounded-xl bg-surface-success-subtle p-8 text-center'}>
        <p className={'text-lg font-semibold text-content-success-bold'}>
          {'문의가 정상적으로 접수되었습니다.\r'}
        </p>
        <p className={'mt-2 text-sm text-content-success'}>
          {'확인 후 빠르게 답변드리겠습니다. 감사합니다.\r'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className={'mt-4 text-sm text-content-success underline'}
        >
          {'추가 문의하기\r'}
        </button>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-line-primary bg-surface-primary text-content-primary focus:ring-2 focus:ring-line-focus-ring focus:border-transparent outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className={'space-y-5'}>
      {/* Web3Forms config */}
      <input type={'hidden'} name={'access_key'} value={'YOUR_WEB3FORMS_ACCESS_KEY'} />
      <input type={'hidden'} name={'subject'} value={'한국해양기상기술 홈페이지 문의'} />
      <input type={'hidden'} name={'from_name'} value={'한국해양기상기술 문의'} />

      <div className={'grid gap-5 md:grid-cols-2'}>
        <div>
          <label htmlFor={'name'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
            {'이름 *\r'}
          </label>
          <input type={'text'} id={'name'} name={'name'} required className={inputClass} />
        </div>
        <div>
          <label htmlFor={'organization'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
            {'소속/기관명\r'}
          </label>
          <input type={'text'} id={'organization'} name={'organization'} className={inputClass} />
        </div>
      </div>

      <div className={'grid gap-5 md:grid-cols-2'}>
        <div>
          <label htmlFor={'email'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
            {'이메일 *\r'}
          </label>
          <input type={'email'} id={'email'} name={'email'} required className={inputClass} />
        </div>
        <div>
          <label htmlFor={'phone'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
            {'연락처\r'}
          </label>
          <input type={'tel'} id={'phone'} name={'phone'} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor={'inquiry_type'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
          {'문의 유형 *\r'}
        </label>
        <select id={'inquiry_type'} name={'inquiry_type'} required className={inputClass}>
          <option value={''}>{'선택해주세요'}</option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={'title'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
          {'문의 제목 *\r'}
        </label>
        <input type={'text'} id={'title'} name={'title'} required className={inputClass} />
      </div>

      <div>
        <label htmlFor={'message'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
          {'문의 내용 *\r'}
        </label>
        <textarea id={'message'} name={'message'} rows={6} required className={`${ inputClass } resize-y`} />
      </div>

      <div>
        <label htmlFor={'attachment'} className={'mb-1 block text-sm font-medium text-content-secondary'}>
          {'첨부파일 (5MB 이하)\r'}
        </label>
        <input
          type={'file'}
          id={'attachment'}
          name={'attachment'}
          className={'w-full text-sm text-content-tertiary file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface-info-subtle file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-interactive-primary file:transition-colors hover:file:bg-interactive-selected-hovered'}
        />
      </div>

      <div className={'flex items-start gap-2'}>
        <input type={'checkbox'} id={'privacy'} name={'privacy'} required className={'mt-1 rounded border-line-primary'} />
        <label htmlFor={'privacy'} className={'text-sm text-content-tertiary'}>
          {'개인정보 수집 및 이용에 동의합니다. *\r'}
        </label>
      </div>

      {status === 'error' && (
        <p className={'text-sm text-content-danger'}>{errorMessage}</p>
      )}

      <button
        type={'submit'}
        disabled={status === 'submitting'}
        className={'w-full rounded-lg bg-interactive-primary px-6 py-3 font-medium text-content-interactive-inverse transition-colors hover:bg-interactive-primary-hovered active:bg-interactive-primary-pressed disabled:cursor-not-allowed disabled:opacity-50'}
      >
        {status === 'submitting' ? '전송 중...' : '문의하기'}
      </button>
    </form>
  );
}
