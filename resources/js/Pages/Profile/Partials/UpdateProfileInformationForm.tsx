import { router } from '@inertiajs/core';
import { Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { User } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';

interface Props {
  user: User;
}

export default function FormularioActualizarInformacionPerfil({ user }: Props) {
  const form = useForm({
    _method: 'PUT',
    name: user.name,
    email: user.email,
    photo: null as File | null,
  });
  const route = useRoute();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const page = useTypedPage();
  const [verificationLinkSent, setVerificationLinkSent] = useState(false);

  function actualizarInformacionPerfil() {
    form.post(route('user-profile-information.update'), {
      errorBag: 'updateProfileInformation',
      preserveScroll: true,
      onSuccess: () => limpiarEntradaArchivoFoto(),
    });
  }

  function seleccionarNuevaFoto() {
    photoRef.current?.click();
  }

  function actualizarVistaPreviaFoto() {
    const photo = photoRef.current?.files?.[0];

    if (!photo) {
      return;
    }

    form.setData('photo', photo);

    const reader = new FileReader();

    reader.onload = e => {
      setPhotoPreview(e.target?.result as string);
    };

    reader.readAsDataURL(photo);
  }

  function eliminarFoto() {
    router.delete(route('current-user-photo.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        setPhotoPreview(null);
        limpiarEntradaArchivoFoto();
      },
    });
  }

  function limpiarEntradaArchivoFoto() {
    if (photoRef.current?.value) {
      photoRef.current.value = '';
      form.setData('photo', null);
    }
  }

  return (
    <FormSection
      onSubmit={actualizarInformacionPerfil}
      title={'Información del Perfil'}
      description={`Actualiza la información de tu cuenta y la dirección de correo electrónico.`}
      renderActions={() => (
        <>
          <ActionMessage on={form.recentlySuccessful} className="mr-3">
            Guardado.
          </ActionMessage>

          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Guardar
          </PrimaryButton>
        </>
      )}
    >
      {/* <!-- Foto de Perfil --> */}
      {page.props.jetstream.managesProfilePhotos ? (
        <div className="col-span-6 sm:col-span-4">
          {/* <!-- Entrada de archivo de foto de perfil --> */}
          <input
            type="file"
            className="hidden"
            ref={photoRef}
            onChange={actualizarVistaPreviaFoto}
          />

          <InputLabel htmlFor="photo" value="Foto" />

          {photoPreview ? (
            // <!-- Vista previa de nueva foto de perfil -->
            <div className="mt-2">
              <span
                className="block rounded-full w-20 h-20"
                style={{
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundImage: `url('${photoPreview}')`,
                }}
              ></span>
            </div>
          ) : (
            // <!-- Foto de perfil actual -->
            <div className="mt-2">
              {
                      page.props.auth.user?.profile_photo_path?
                      (<img
                        className="rounded-full h-20 w-20 object-cover"
                        src={`/storage/${user.profile_photo_path}`}
                      alt={user.name}
                    />):
                      (
                      <img
                      className="rounded-full h-20 w-20 object-cover"
                      src={`${user.profile_photo_url}`}
                        alt={user.name}
                      />)}
            </div>
          )}

          <SecondaryButton
            className="mt-2 mr-2"
            type="button"
            onClick={seleccionarNuevaFoto}
          >
            Seleccionar una nueva foto
          </SecondaryButton>

          {user.profile_photo_path ? (
            <SecondaryButton
              type="button"
              className="mt-2"
              onClick={eliminarFoto}
            >
              Eliminar foto
            </SecondaryButton>
          ) : null}

          <InputError message={form.errors.photo} className="mt-2" />
        </div>
      ) : null}

      {/* <!-- Nombre --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Nombre" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          autoComplete="name"
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>

      {/* <!-- Correo electrónico --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="email" value="Correo electrónico" />
        <TextInput
          id="email"
          type="email"
          className="mt-1 block w-full"
          value={form.data.email}
          onChange={e => form.setData('email', e.currentTarget.value)}
        />
        <InputError message={form.errors.email} className="mt-2" />

        {page.props.jetstream.hasEmailVerification &&
        user.email_verified_at === null ? (
          <div>
            <p className="text-sm mt-2 dark:text-white">
              Tu dirección de correo electrónico no está verificada.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                onClick={e => {
                  e.preventDefault();
                  setVerificationLinkSent(true);
                }}
              >
                Haz clic aquí para re-enviar el correo de verificación.
              </Link>
            </p>
            {verificationLinkSent && (
              <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </FormSection>
  );
}
