import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function TwoFactorChallenge() {
  const route = useRoute();
  const [recovery, setRecovery] = useState(false);
  const form = useForm({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  function toggleRecovery(e: React.FormEvent) {
    e.preventDefault();
    const isRecovery = !recovery;
    setRecovery(isRecovery);

    setTimeout(() => {
      if (isRecovery) {
        recoveryCodeRef.current?.focus();
        form.setData('code', '');
      } else {
        codeRef.current?.focus();
        form.setData('recovery_code', '');
      }
    }, 100);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('two-factor.login'));
  }

  return (
    <AuthenticationCard>
      <Head title="Confirmación de Doble Factor" />

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {recovery
          ? 'Por favor confirme el acceso a su cuenta ingresando uno de sus códigos de recuperación de emergencia.'
          : 'Por favor confirme el acceso a su cuenta ingresando el código de autenticación proporcionado por su aplicación de autenticación.'}
      </div>

      <form onSubmit={onSubmit}>
        {recovery ? (
          <div>
            <InputLabel htmlFor="recovery_code">Código de Recuperación</InputLabel>
            <TextInput
              id="recovery_code"
              type="text"
              className="mt-1 block w-full"
              value={form.data.recovery_code}
              onChange={e =>
                form.setData('recovery_code', e.currentTarget.value)
              }
              ref={recoveryCodeRef}
              autoComplete="one-time-code"
            />
            <InputError className="mt-2" message={form.errors.recovery_code} />
          </div>
        ) : (
          <div>
            <InputLabel htmlFor="code">Código</InputLabel>
            <TextInput
              id="code"
              type="text"
              inputMode="numeric"
              className="mt-1 block w-full"
              value={form.data.code}
              onChange={e => form.setData('code', e.currentTarget.value)}
              autoFocus
              autoComplete="one-time-code"
              ref={codeRef}
            />
            <InputError className="mt-2" message={form.errors.code} />
          </div>
        )}

        <div className="flex items-center justify-end mt-4">
          <button
            type="button"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 underline cursor-pointer"
            onClick={toggleRecovery}
          >
            {recovery ? 'Usar un código de autenticación' : 'Usar un código de recuperación'}
          </button>

          <PrimaryButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Iniciar sesión
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  );
}
