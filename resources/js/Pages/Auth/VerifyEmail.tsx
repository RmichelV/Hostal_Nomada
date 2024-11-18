import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import PrimaryButton from '@/Components/PrimaryButton';

interface Props {
  status: string;
}

export default function VerifyEmail({ status }: Props) {
  const route = useRoute();
  const form = useForm({});
  const verificationLinkSent = status === 'verification-link-sent';

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('verification.send'));
  }

  return (
    <AuthenticationCard>
      <Head title="Verificación de Correo Electrónico" />

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Antes de continuar, ¿podrías verificar tu dirección de correo electrónico
        haciendo clic en el enlace que acabamos de enviarte? Si no recibiste el
        correo, con gusto te enviaremos otro.
      </div>

      {verificationLinkSent && (
        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
          Se ha enviado un nuevo enlace de verificación a la dirección de correo
          electrónico que proporcionaste durante el registro.
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Reenviar Correo de Verificación
          </PrimaryButton>

          <div>
            <Link
              href={route('profile.show')}
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Editar Perfil
            </Link>
          </div>

          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ml-2"
          >
            Cerrar sesión
          </Link>
        </div>
      </form>
    </AuthenticationCard>
  );
}
