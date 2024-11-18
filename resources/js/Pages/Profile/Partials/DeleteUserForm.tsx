import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionSection from '@/Components/ActionSection';
import DangerButton from '@/Components/DangerButton';
import DialogModal from '@/Components/DialogModal';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

export default function DeleteUserForm() {
  const route = useRoute();
  const [confirmandoEliminacionUsuario, setConfirmandoEliminacionUsuario] = useState(false);
  const form = useForm({
    password: '',
  });
  const passwordRef = useRef<HTMLInputElement>(null);

  function confirmarEliminacionUsuario() {
    setConfirmandoEliminacionUsuario(true);

    setTimeout(() => passwordRef.current?.focus(), 250);
  }

  function eliminarUsuario() {
    form.delete(route('current-user.destroy'), {
      preserveScroll: true,
      onSuccess: () => cerrarModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    });
  }

  function cerrarModal() {
    setConfirmandoEliminacionUsuario(false);
    form.reset();
  }

  return (
    <ActionSection
      title={'Eliminar cuenta'}
      description={'Elimina permanentemente tu cuenta.'}
    >
      <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
        Una vez que tu cuenta sea eliminada, todos sus recursos y datos se
        eliminarán permanentemente. Antes de eliminar tu cuenta, por favor
        descarga cualquier dato o información que desees conservar.
      </div>

      <div className="mt-5">
        <DangerButton onClick={confirmarEliminacionUsuario}>
          Eliminar cuenta
        </DangerButton>
      </div>

      {/* <!-- Modal de confirmación de eliminación de cuenta --> */}
      <DialogModal isOpen={confirmandoEliminacionUsuario} onClose={cerrarModal}>
        <DialogModal.Content title={'Eliminar cuenta'}>
          ¿Estás seguro de que deseas eliminar tu cuenta? Una vez eliminada,
          todos sus recursos y datos se eliminarán permanentemente. Por favor,
          ingresa tu contraseña para confirmar que deseas eliminar tu cuenta de
          manera permanente.
          <div className="mt-4">
            <TextInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="Contraseña"
              value={form.data.password}
              onChange={e => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={cerrarModal}>Cancelar</SecondaryButton>

          <DangerButton
            onClick={eliminarUsuario}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Eliminar cuenta
          </DangerButton>
        </DialogModal.Footer>
      </DialogModal>
    </ActionSection>
  );
}
