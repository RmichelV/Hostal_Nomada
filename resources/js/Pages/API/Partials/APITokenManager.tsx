import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import ActionSection from '@/Components/ActionSection';
import Checkbox from '@/Components/Checkbox';
import ConfirmationModal from '@/Components/ConfirmationModal';
import DangerButton from '@/Components/DangerButton';
import DialogModal from '@/Components/DialogModal';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import SectionBorder from '@/Components/SectionBorder';
import { ApiToken } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';

interface Props {
  tokens: ApiToken[];
  availablePermissions: string[];
  defaultPermissions: string[];
}

export default function APITokenManager({
  tokens,
  availablePermissions,
  defaultPermissions,
}: Props) {
  const route = useRoute();
  const createApiTokenForm = useForm({
    name: '',
    permissions: defaultPermissions,
  });
  const updateApiTokenForm = useForm({
    permissions: [] as string[],
  });
  const deleteApiTokenForm = useForm({});
  const [displayingToken, setDisplayingToken] = useState(false);
  const [managingPermissionsFor, setManagingPermissionsFor] =
    useState<ApiToken | null>(null);
  const [apiTokenBeingDeleted, setApiTokenBeingDeleted] =
    useState<ApiToken | null>(null);
  const page = useTypedPage();

  function createApiToken() {
    createApiTokenForm.post(route('api-tokens.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setDisplayingToken(true);
        createApiTokenForm.reset();
      },
    });
  }

  function manageApiTokenPermissions(token: ApiToken) {
    updateApiTokenForm.setData('permissions', token.abilities);
    setManagingPermissionsFor(token);
  }

  function updateApiToken() {
    if (!managingPermissionsFor) {
      return;
    }
    updateApiTokenForm.put(
      route('api-tokens.update', [managingPermissionsFor]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setManagingPermissionsFor(null),
      },
    );
  }

  function confirmApiTokenDeletion(token: ApiToken) {
    setApiTokenBeingDeleted(token);
  }

  function deleteApiToken() {
    if (!apiTokenBeingDeleted) {
      return;
    }
    deleteApiTokenForm.delete(
      route('api-tokens.destroy', [apiTokenBeingDeleted]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setApiTokenBeingDeleted(null),
      },
    );
  }

  return (
    <div>
      {/* <!-- Crear un Token de API --> */}
      <FormSection
        onSubmit={createApiToken}
        title={'Crear un Token de API'}
        description={
          'Los tokens de API permiten a servicios externos autenticarse con nuestra aplicación en tu nombre.'
        }
        renderActions={() => (
          <>
            <ActionMessage
              on={createApiTokenForm.recentlySuccessful}
              className="mr-3"
            >
              Creado.
            </ActionMessage>

            <PrimaryButton
              className={classNames({
                'opacity-25': createApiTokenForm.processing,
              })}
              disabled={createApiTokenForm.processing}
            >
              Crear
            </PrimaryButton>
          </>
        )}
      >
        {/* <!-- Nombre del Token --> */}
        <div className="col-span-6 sm:col-span-4">
          <InputLabel htmlFor="name">Nombre</InputLabel>
          <TextInput
            id="name"
            type="text"
            className="mt-1 block w-full"
            value={createApiTokenForm.data.name}
            onChange={e =>
              createApiTokenForm.setData('name', e.currentTarget.value)
            }
            autoFocus
          />
          <InputError
            message={createApiTokenForm.errors.name}
            className="mt-2"
          />
        </div>

        {/* <!-- Permisos del Token --> */}
        {availablePermissions.length > 0 && (
          <div className="col-span-6">
            <InputLabel htmlFor="permissions">Permisos</InputLabel>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePermissions.map(permission => (
                <div key={permission}>
                  <label className="flex items-center">
                    <Checkbox
                      value={permission}
                      checked={createApiTokenForm.data.permissions.includes(
                        permission,
                      )}
                      onChange={e => {
                        if (
                          createApiTokenForm.data.permissions.includes(
                            e.currentTarget.value,
                          )
                        ) {
                          createApiTokenForm.setData(
                            'permissions',
                            createApiTokenForm.data.permissions.filter(
                              p => p !== e.currentTarget.value,
                            ),
                          );
                        } else {
                          createApiTokenForm.setData('permissions', [
                            e.currentTarget.value,
                            ...createApiTokenForm.data.permissions,
                          ]);
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {permission}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormSection>

      {tokens.length > 0 ? (
        <div>
          <SectionBorder />

          {/* <!-- Administrar Tokens de API --> */}
          <div className="mt-10 sm:mt-0">
            <ActionSection
              title={'Administrar Tokens de API'}
              description={
                'Puedes eliminar cualquier token existente si ya no lo necesitas.'
              }
            >
              {/* <!-- Lista de Tokens de API --> */}
              <div className="space-y-6">
                {tokens.map(token => (
                  <div
                    className="flex items-center justify-between"
                    key={token.id}
                  >
                    <div className="break-all dark:text-white">
                      {token.name}
                    </div>

                    <div className="flex items-center">
                      {token.last_used_ago && (
                        <div className="text-sm text-gray-400">
                          Último uso: {token.last_used_ago}
                        </div>
                      )}

                      {availablePermissions.length > 0 ? (
                        <PrimaryButton
                          className="cursor-pointer ml-6 text-sm text-gray-400 underline"
                          onClick={() => manageApiTokenPermissions(token)}
                        >
                          Permisos
                        </PrimaryButton>
                      ) : null}

                      <PrimaryButton
                        className="cursor-pointer ml-6 text-sm text-red-500"
                        onClick={() => confirmApiTokenDeletion(token)}
                      >
                        Eliminar
                      </PrimaryButton>
                    </div>
                  </div>
                ))}
              </div>
            </ActionSection>
          </div>
        </div>
      ) : null}

      {/* <!-- Modal de Valor del Token --> */}
      <DialogModal
        isOpen={displayingToken}
        onClose={() => setDisplayingToken(false)}
      >
        <DialogModal.Content title={'Token de API'}>
          <div>
            Por favor, copia tu nuevo token de API. Por seguridad, no se mostrará
            nuevamente.
          </div>

          <div className="mt-4 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded font-mono text-sm text-gray-500">
            {page.props?.jetstream?.flash?.token}
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={() => setDisplayingToken(false)}>
            Cerrar
          </SecondaryButton>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- Modal de Permisos del Token --> */}
      <DialogModal
        isOpen={!!managingPermissionsFor}
        onClose={() => setManagingPermissionsFor(null)}
      >
        <DialogModal.Content title={'Permisos del Token de API'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePermissions.map(permission => (
              <div key={permission}>
                <label className="flex items-center">
                  <Checkbox
                    value={permission}
                    checked={updateApiTokenForm.data.permissions.includes(
                      permission,
                    )}
                    onChange={e => {
                      if (
                        updateApiTokenForm.data.permissions.includes(
                          e.currentTarget.value,
                        )
                      ) {
                        updateApiTokenForm.setData(
                          'permissions',
                          updateApiTokenForm.data.permissions.filter(
                            p => p !== e.currentTarget.value,
                          ),
                        );
                      } else {
                        updateApiTokenForm.setData('permissions', [
                          e.currentTarget.value,
                          ...updateApiTokenForm.data.permissions,
                        ]);
                      }
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {permission}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={() => setManagingPermissionsFor(null)}>
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={updateApiToken}
            className={classNames('ml-2', {
              'opacity-25': updateApiTokenForm.processing,
            })}
            disabled={updateApiTokenForm.processing}
          >
            Guardar
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- Modal de Confirmación para Eliminar Token --> */}
      <ConfirmationModal
        isOpen={!!apiTokenBeingDeleted}
        onClose={() => setApiTokenBeingDeleted(null)}
      >
        <ConfirmationModal.Content title={'Eliminar Token de API'}>
          ¿Estás seguro de que deseas eliminar este token de API?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={() => setApiTokenBeingDeleted(null)}>
            Cancelar
          </SecondaryButton>

          <DangerButton
            onClick={deleteApiToken}
            className={classNames('ml-2', {
              'opacity-25': deleteApiTokenForm.processing,
            })}
            disabled={deleteApiTokenForm.processing}
          >
            Eliminar
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </div>
  );
}
