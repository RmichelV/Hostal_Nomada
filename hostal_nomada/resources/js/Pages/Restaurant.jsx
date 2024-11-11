import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import welcome from '/resources/css/Welcome.module.css';

export default function Restaurant({ auth, laravelVersion, phpVersion, restaurants }) {
    
    return (
        <>
            <Head title="Restaurant" />
            <AuthenticatedLayout
            
                header={
                    <h2 className={`${welcome.title_h}`}>
                        Restaurant - Menu
                    </h2>
                }
            >
                
            </AuthenticatedLayout>
            <header className="bg-white shadow">
                    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${welcome.title_h}`}>
                        Nuestro Menu  
                    </div>
            </header>
            {restaurants.map((restaurant, menu) => (
                <div className={`${welcome.container}`} key={menu}>
                    
                        <img src={`img/${restaurant.food_image}`} alt="Room Image" className={welcome.room_image} />
                    
                    <div className={`${welcome.text_container}`}>
                        <h3 className={welcome.room_title}>{restaurant.name}</h3>
                        <div className={welcome.room_description}>{restaurant.description}</div>
                    </div>
                </div>
            ))}
        </>
    );
}
