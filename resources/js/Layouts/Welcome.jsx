import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import Content from '../Components/Content';

export default function Welcome({ auth, laravelVersion, phpVersion,rooms }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
            <Layout>
                <Head title="Welcome" />
                <Content />
            </Layout>
    );
}