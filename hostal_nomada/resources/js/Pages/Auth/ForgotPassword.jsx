import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { useState } from 'react';  

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [customErrorMessage, setCustomErrorMessage] = useState('');

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'),{
            onError: (errors) => {
                if (errors.email && errors.email.includes("We can't find a user with that email address.")) {
                    setCustomErrorMessage('No podemos encontrar un usuario con ese email.');
                }
            },
        });
    };

    return (
        
        <>
        <AuthenticatedLayout/>
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
            ¿Olvidaste tu contraseña? No hay problema. Solo indícanos tu dirección de correo electrónico 
            y te enviaremos un enlace para restablecer tu contraseña, que te permitirá elegir una nueva.​
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                {/* <InputError message={errors.email} className="mt-2" /> */}
                {customErrorMessage && (
                                <div className="mt-2 text-red-600">
                                    {customErrorMessage}
                                </div>
                )} 

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Enviar enlace para restablecer contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout> 
        
        </>
    );
}
