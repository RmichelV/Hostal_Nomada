import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import welcome from '/resources/css/Welcome.module.css';
import Navbar from '../../css/NavBar.module.css'

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
            <AuthenticatedLayout/>
            <main className={Navbar.mainTitle}>
                <img src="img/LaPaz.png" alt="La Paz" className={Navbar.BannerLaPaz} id='bannerLaPaz' />
                <div className={`${Navbar.title}`}>
                    <h1 className={Navbar.title_up}>
                        HOSTAL NOMADA SUITES
                    </h1>
                    <h2 className={`${Navbar.title_down}`}>
                        El mejor hostal ubicado en la ciudad maravilla La Paz - Bolivia
                    </h2>
                </div>
            </main>

            <header className="bg-white shadow">
                    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${welcome.title_h}`}>
                        Nuestras habitaciones   
                    </div>
            </header>

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
