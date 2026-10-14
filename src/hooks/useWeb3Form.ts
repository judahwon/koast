import { useState, type FormEvent } from 'react';

// 플레이스홀더라 실제 전송은 실패한다. web3forms 에서 발급받은 키로 교체할 것.
export const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Options {
  fileField: string;
  allowedExtension?: string;
}

export function useWeb3Form({ fileField, allowedExtension }: Options) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function fail(message: string) {
    setErrorMessage(message);
    setStatus('error');
  }

  function validateFile(file: FormDataEntryValue | null) {
    if (!(file instanceof File) || file.size === 0) return null;
    if (allowedExtension && !file.name.toLowerCase().endsWith(`.${ allowedExtension }`)) {
      return `${ allowedExtension.toUpperCase() } 파일만 업로드 가능합니다.`;
    }
    if (file.size > MAX_FILE_BYTES) return '파일 크기는 5MB 이하만 가능합니다.';
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fileError = validateFile(formData.get(fileField));
    if (fileError) {
      fail(fileError);
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        fail('전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      fail('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  return {
    status,
    errorMessage,
    handleSubmit,
    reset: () => setStatus('idle'),
  };
}
