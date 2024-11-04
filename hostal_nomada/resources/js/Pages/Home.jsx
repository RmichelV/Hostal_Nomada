import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asegúrate de importar el layout correcto
import welcome from '/resources/css/Welcome.module.css';
//direcciones 
import { useNavigate } from 'react-router-dom';


export default function Home({ auth, laravelVersion, phpVersion, room_types }) {
    
    console.log(room_types);

    function reservar(){
        window.location.href = 'login'; // Ruta relativa

    }
    return (
        <>
            <Head title="Home"/>
             {/** banner */}
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
            <AuthenticatedLayout
                header={
                    <h2 className={`${welcome.title_h}`}>
                        Nuestras habitaciones 
                    </h2>
            }
            />

            {room_types.map((room_type, index) => (
                <div className={`${welcome.container}`} key={index}>
                    
                        <img src={`img/${room_type.room_image}`} alt="Room Image" className={welcome.room_image} />
                    
                    <div className={`${welcome.text_container}`}>
                        <h3 className={welcome.room_title}>{room_type.name}</h3>
                        <div className={welcome.room_description} >{room_type.description}</div>
                        <div className={welcome.room_price}>
                            Precio. {room_type.price}
                        </div>    

                        <button className={`${welcome.room_button}`} onClick={reservar}  >
                            Reservar
                        </button>
                    </div>
                </div>


            ))}
        </>
    );
}
