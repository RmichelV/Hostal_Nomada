import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import ActionSection from '@/Components/ActionSection';
import DialogModal from '@/Components/DialogModal';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { Session } from '@/types';

interface Props {
  sessions: Session[];
}

export default function LogoutOtherBrowserSessions({ sessions }: Props) {
  const [confirmandoLogout, setConfirmandoLogout] = useState(false);
  const route = useRoute();
  const passwordRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    password: '',
  });

  function confirmarLogout() {
    setConfirmandoLogout(true);

    setTimeout(() => passwordRef.current?.focus(), 250);
  }

  function logoutOtrasSesionesNavegador() {
    form.delete(route('other-browser-sessions.destroy'), {
      preserveScroll: true,
      onSuccess: () => cerrarModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    });
  }

  function cerrarModal() {
    setConfirmandoLogout(false);

    form.reset();
  }

  return (
    <ActionSection
      title={'Sesiones del navegador'}
      description={
        'Gestiona y cierra tus sesiones activas en otros navegadores y dispositivos.'
      }
    >
      <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
        Si es necesario, puedes cerrar todas tus sesiones en otros navegadores
        a través de todos tus dispositivos. Algunas de tus sesiones recientes se
        listan a continuación; sin embargo, esta lista puede no ser exhaustiva.
        Si crees que tu cuenta ha sido comprometida, también deberías actualizar
        tu contraseña.
      </div>

      {/* <!-- Otras Sesiones de Navegador --> */}
      {sessions.length > 0 ? (
        <div className="mt-5 space-y-6">
          {sessions.map((session, i) => (
            <div className="flex items-center" key={i}>
              <div>
                {session.agent.is_desktop ? (
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M0 0h24v24H0z" stroke="none"></path>
                    <rect x="7" y="4" width="10" height="16" rx="1"></rect>
                    <path d="M11 5h2M12 17v.01"></path>
                  </svg>
                )}
              </div>

              <div className="ml-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {session.agent.platform} - {session.agent.browser}
                </div>

                <div>
                  <div className="text-xs text-gray-500">
                    {session.ip_address},
                    {session.is_current_device ? (
                      <span className="text-green-500 font-semibold">
                        Este dispositivo
                      </span>
                    ) : (
                      <span>Última actividad {session.last_active}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center mt-5">
        <PrimaryButton onClick={confirmarLogout}>
          Cerrar sesión en otras sesiones del navegador
        </PrimaryButton>

        <ActionMessage on={form.recentlySuccessful} className="ml-3">
          Hecho.
        </ActionMessage>
      </div>

      {/* <!-- Modal de Confirmación de Cerrar Sesión en Otros Dispositivos --> */}
      <DialogModal isOpen={confirmandoLogout} onClose={cerrarModal}>
        <DialogModal.Content title={'Cerrar sesión en otras sesiones del navegador'}>
          Por favor ingresa tu contraseña para confirmar que deseas cerrar sesión en
          tus otras sesiones de navegador a través de todos tus dispositivos.
          <div className="mt-4">
            <TextInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="Contraseña"
              ref={passwordRef}
              value={form.data.password}
              onChange={e => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={cerrarModal}>Cancelar</SecondaryButton>

          <PrimaryButton
            onClick={logoutOtrasSesionesNavegador}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Cerrar sesión en otras sesiones del navegador
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </ActionSection>
  );
}
