import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import welcome from '/resources/css/Welcome.module.css';

export default function Welcome({ auth, laravelVersion, phpVersion, room_types }) {
    
// console.log(room_types);
const user = auth ? auth.user : null;

console.log('holaaa : '+ user);  

    function reservar() {
        if (!user) {
            window.location.href = '/reservations'; 
        }
    }
    return (
        <>
            <Head title="Welcome" />
            <AuthenticatedLayout
            
                header={
                    <h2 className={`${welcome.title_h}`}>
                        Nuestras habitaciones
                    </h2>
                }
            >
                
            </AuthenticatedLayout>

            {room_types.map((room_type, index) => (
                <div className={`${welcome.container}`} key={index}>
                    
                        <img src={`img/${room_type.room_image}`} alt="Room Image" className={welcome.room_image} />
                    
                    <div className={`${welcome.text_container}`}>
                        <h3 className={welcome.room_title}>{room_type.name}</h3>
                        <div className={welcome.room_description}>{room_type.description}</div>
                        <div className={welcome.room_price}>
                            Precio Bs.{room_type.price}
                            </div>    
                        <button className={welcome.room_button} onClick={reservar}>
                            Reservar
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
