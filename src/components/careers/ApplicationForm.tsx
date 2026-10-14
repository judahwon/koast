import { FormSuccess, fileInputClass, inputClass, labelClass, submitClass } from '@/components/common/FormParts';
import { WEB3FORMS_ACCESS_KEY, useWeb3Form } from '@/hooks/useWeb3Form';

interface Props {
  jobTitle: string;
  jobSlug: string;
}

export default function ApplicationForm({ jobTitle, jobSlug }: Props) {
  const { status, errorMessage, handleSubmit, reset } = useWeb3Form({ fileField: 'resume', allowedExtension: 'pdf' });

  if (status === 'success') {
    return (
      <FormSuccess
        title={'지원서가 정상적으로 접수되었습니다.'}
        message={'검토 후 안내드리겠습니다. 감사합니다.'}
        actionLabel={'추가 지원하기'}
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={'space-y-6'}>
      <input type={'hidden'} name={'access_key'} value={WEB3FORMS_ACCESS_KEY} />
      <input type={'hidden'} name={'subject'} value={`채용 지원: ${ jobTitle }`} />
      <input type={'hidden'} name={'from_name'} value={'한국해양기상기술 채용'} />
      <input type={'hidden'} name={'job_slug'} value={jobSlug} />

      <div className={'grid gap-6 md:grid-cols-2'}>
        <div>
          <label htmlFor={'name'} className={labelClass}>
            {'이름 *'}
          </label>
          <input type={'text'} id={'name'} name={'name'} required className={inputClass} />
        </div>
        <div>
          <label htmlFor={'email'} className={labelClass}>
            {'이메일 *'}
          </label>
          <input type={'email'} id={'email'} name={'email'} required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor={'phone'} className={labelClass}>
          {'연락처'}
        </label>
        <input type={'tel'} id={'phone'} name={'phone'} className={inputClass} />
      </div>

      <div>
        <label htmlFor={'message'} className={labelClass}>
          {'자기소개 / 지원 동기'}
        </label>
        <textarea id={'message'} name={'message'} rows={5} className={`${ inputClass } resize-y`} />
      </div>

      <div>
        <label htmlFor={'resume'} className={labelClass}>
          {'이력서 (PDF, 5MB 이하) *'}
        </label>
        <input type={'file'} id={'resume'} name={'resume'} accept={'.pdf'} required className={fileInputClass} />
      </div>

      {status === 'error' && (
        <p className={'text-sm text-content-danger'}>{errorMessage}</p>
      )}

      <button
        type={'submit'}
        disabled={status === 'submitting'}
        className={`${ submitClass } w-full`}
      >
        {status === 'submitting' ? '전송 중...' : '지원하기'}
      </button>
    </form>
  );
}
