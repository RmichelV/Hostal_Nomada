import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdministrationBar from '@/Layouts/AdministrationNav';
import { Head } from '@inertiajs/react';

export default function Administration() {
    return (
        <div>
            <Head title="Administracion"/>
            <AuthenticatedLayout/>
            <AdministrationBar/>
        </div>

    );
}
