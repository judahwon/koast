import { FormSuccess, fileInputClass, inputClass, labelClass, submitClass } from '@/components/common/FormParts';
import { WEB3FORMS_ACCESS_KEY, useWeb3Form } from '@/hooks/useWeb3Form';

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
  const { status, errorMessage, handleSubmit, reset } = useWeb3Form({ fileField: 'attachment' });

  if (status === 'success') {
    return (
      <FormSuccess
        title={'문의가 정상적으로 접수되었습니다.'}
        message={'확인 후 빠르게 답변드리겠습니다. 감사합니다.'}
        actionLabel={'추가 문의하기'}
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={'rounded-2xl border border-line-secondary bg-surface-primary p-6 sm:p-10'}>
      <input type={'hidden'} name={'access_key'} value={WEB3FORMS_ACCESS_KEY} />
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
        <input type={'file'} id={'attachment'} name={'attachment'} className={fileInputClass} />
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
          className={`${ submitClass } w-full sm:w-auto sm:min-w-56`}
        >
          {status === 'submitting' ? '전송 중...' : '문의 보내기'}
        </button>
      </div>
    </form>
  );
}
