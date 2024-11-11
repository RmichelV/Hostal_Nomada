import { useState } from 'react'; 
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import Log from '../../../css/LogReg.module.css';
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [customErrorMessage, setCustomErrorMessage] = useState('');

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onError: (errors) => {
                if (errors.email && errors.email.includes("These credentials do not match our records.")) {
                    setCustomErrorMessage('Credenciales incorrectas. Por favor, intenta nuevamente.');
                }
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
        <AuthenticatedLayout/>
            {/* <GuestLayout> */}
                <Head title="Log in" />

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <main className={Log.mainTitle}>
                    <img src="img/LaPaz.png" alt="La Paz" className={Log.BannerLaPaz} id='bannerLaPaz' />
                    <div className={Log.title}>

                    <form onSubmit={submit} className={Log.fm}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" className={Log.lab} />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`mt-1 block w-full ${Log.inp}`}
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            {/* <InputError message={errors.email} className="mt-2" /> */}
                            {customErrorMessage && (
                                <div className="mt-2 text-red-600">
                                    {customErrorMessage}
                                </div>
                            )} 
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" className={Log.lab} />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={`mt-1 block w-full ${Log.inp}`}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600" >
                                    Recordarme
                                </span>
                            </label>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Olvisdaste tu contraseña?
                                </Link>
                            )}

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Ingresar
                            </PrimaryButton>
                        </div>
                    </form>
                    </div>
                </main>
                
            {/* </GuestLayout> */}
        </>
    );
}
