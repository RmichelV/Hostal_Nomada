import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Country {
    id: number;
    name: string;
  }
  interface RegistrarProps {
    countries: Country[];
  }
export default function Registrar({ countries=[] }: RegistrarProps) {
  const page = useTypedPage();
  const route = useRoute();
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
    country_id: '',
    // rol_id: '',
    identification_number: '',
    birthday: '',
    phone: '',
  });

  function onSubmit(e: any) {
    e.preventDefault();
    form.post(route('register'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  // const { countries }: RegistrarProps = page.props;

  return (
    <AuthenticationCard>
      <Head title="Registrar" />

      <form onSubmit={onSubmit}>
        <div>
          <InputLabel htmlFor="name">Nombre</InputLabel>
          <TextInput
            id="name"
            type="text"
            className="mt-1 block w-full"
            value={form.data.name}
            onChange={(e) => form.setData('name', e.currentTarget.value)}
            required
            autoFocus
            autoComplete="name"
          />
          <InputError className="mt-2" message={form.errors.name} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="email">Correo Electrónico</InputLabel>
          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={(e) => form.setData('email', e.currentTarget.value)}
            required
          />
          <InputError className="mt-2" message={form.errors.email} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <TextInput
            id="password"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={(e) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
          <InputError className="mt-2" message={form.errors.password} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation">Confirmar Contraseña</InputLabel>
          <TextInput
            id="password_confirmation"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password_confirmation}
            onChange={(e) => form.setData('password_confirmation', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
          <InputError
            className="mt-2"
            message={form.errors.password_confirmation}
          />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="country_id">País</InputLabel>
          <select
            id="country_id"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={form.data.country_id}
            onChange={(e) => form.setData('country_id', e.target.value)}
            required
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <InputError className="mt-2" message={form.errors.country_id} />
        </div>


        {/* <div className="mt-4">
          <InputLabel htmlFor="rol_id">Rol</InputLabel>
          <TextInput
            id="rol_id"
            type="number"
            className="mt-1 block w-full"
            value={form.data.rol_id}
            onChange={(e) => form.setData('rol_id', e.currentTarget.value)}
            required
          />
          <InputError className="mt-2" message={form.errors.rol_id} />
        </div> */}

        <div className="mt-4">
          <InputLabel htmlFor="identification_number">Número de Identificación</InputLabel>
          <TextInput
            id="identification_number"
            type="number"
            className="mt-1 block w-full"
            value={form.data.identification_number}
            onChange={(e) => form.setData('identification_number', e.currentTarget.value)}
            required
          />
          <InputError
            className="mt-2"
            message={form.errors.identification_number}
          />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="birthday">Fecha de Nacimiento</InputLabel>
          <TextInput
            id="birthday"
            type="date"
            className="mt-1 block w-full"
            value={form.data.birthday}
            onChange={(e) => form.setData('birthday', e.currentTarget.value)}
            required
          />
          <InputError className="mt-2" message={form.errors.birthday} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="phone">Teléfono</InputLabel>
          <TextInput
            id="phone"
            type="text"
            className="mt-1 block w-full"
            value={form.data.phone}
            onChange={(e) => form.setData('phone', e.currentTarget.value)}
          />
          <InputError className="mt-2" message={form.errors.phone} />
        </div>

        {page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
          <div className="mt-4">
            <InputLabel htmlFor="terms">
              <div className="flex items-center">
                <Checkbox
                  name="terms"
                  id="terms"
                  checked={form.data.terms}
                  onChange={(e) => form.setData('terms', e.currentTarget.checked)}
                  required
                />

                <div className="ml-2">
                  Acepto los
                  <a
                    target="_blank"
                    href={route('terms.show')}
                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Términos de Servicio
                  </a>
                  y la
                  <a
                    target="_blank"
                    href={route('policy.show')}
                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Política de Privacidad
                  </a>
                </div>
              </div>
              <InputError className="mt-2" message={form.errors.terms} />
            </InputLabel>
          </div>
        )}

        <div className="flex items-center justify-end mt-4">
          <Link
            href={route('login')}
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            ¿Ya tienes cuenta?
          </Link>

          <PrimaryButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Registrarse
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  );
}
