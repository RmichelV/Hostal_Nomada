import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asegúrate de importar el layout correcto
import welcome from '/resources/css/Welcome.module.css';
export default function Welcome({ auth, laravelVersion, phpVersion, room_types }) {
    // Coloca el console.log aquí para verificar los datos de room_types
    console.log(room_types);

    return (
        <>
            <Head title="Welcome" />
            <AuthenticatedLayout/>

            {room_types.map((room_type, index) => (
                <div className={`${welcome.container}`} key={index}>
                    
                        <img src={`img/${room_type.room_image}`} alt="Room Image" className={welcome.room_image} />
                    
                    <div className={`${welcome.text_container}`}>
                        <h3>{room_type.name}</h3>
                        <div>{room_type.description}</div>
                        <div>{room_type.price}</div>    
                        <button>
                            Reservar
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
