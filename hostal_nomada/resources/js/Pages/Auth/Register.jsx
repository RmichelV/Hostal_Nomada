import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({nationalities}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        last_name:'',
        identification_number:'',
        nationality_id:'',
        phone:'',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nombre(s): " />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="last_name" value="Apellido(s): " />

                    <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        className="mt-1 block w-full"
                        autoComplete="last_name"
                        isFocused={true}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                    />

                    <InputError message={errors.last_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="identification_number" value="Número de identificación:" />

                    <TextInput
                        type='number'
                        id="identification_number"
                        name="identification_number"
                        value={data.identification_number}
                        className="mt-1 block w-full"
                        autoComplete="identification_number"
                        isFocused={true}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ''); 
                            setData('identification_number', value);
                        }}
                        required
                    />

                    <InputError message={errors.identification_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="nationality_id" value="Nacionalidad:" />

                    <select name="nationality_id" 
                            id="nationality_id"
                            onChange={(e) => setData('nationality_id', e.target.value)}
                            >
                        <option value="">Selecciona tu Nacionalidad</option>
                        {nationalities.map(nationality=>[
                            <option value={nationality.id}>{nationality.name}</option>
                        ])}
                    </select>

                </div>

                <div>
                    <InputLabel htmlFor="birthday" value="Fecha de Nacimiento:" />

                    <TextInput
                        type='date'
                        id="birthday"
                        name="birthday"
                        value={data.birthday}
                        className="mt-1 block w-full"
                        autoComplete="birthday"
                        isFocused={true}
                        onChange={(e) => {
                            const dateValue = e.target.value;
                            const [year, month, day] = dateValue.split("-");

                            if (year.length > 4) {
                                return; 
                            }
                            setData('birthday', dateValue); 
                        }}
                        required
                    />

                    <InputError message={errors.birthday} className="mt-2" />
                </div>
                
                <div>
                    <InputLabel htmlFor="phone" value="Telefono de contacto:" />

                    <TextInput
                        type='number'
                        id="phone"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        autoComplete="phone"
                        isFocused={true}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ''); 
                            setData('phone', value);
                        }}
                        required
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Ya te haz registrado?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
