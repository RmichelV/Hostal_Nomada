<?php

use App\Http\Controllers\ProfileController;
use App\Models\Room_type;
use App\Models\Restaurant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//agregaciones 
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NationalityController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RestaurantController;



Route::get('/', function () {
    $room_types = Room_type::all();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'room_types' => $room_types
    ]);
});

Route::get('/home', function () {
    $room_types = Room_type::all();
    return Inertia::render('Home',[
        'room_types' => $room_types
    ]);
})->middleware(['auth', 'verified'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

//agregaciones 
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users',UserController::class);
    Route::resource('employees',EmployeeController::class);
    Route::resource('reservations', ReservationController::class);
    Route::resource('room_types',RoomTypeController::class);
    Route::resource('rooms',RoomController::class);
    Route::resource('employees',EmployeeController::class);
    Route::resource('restaurants',RestaurantController::class);
});

Route::resource('nationalities',NationalityController::class);
Route::resource('rols',RolController::class);
Route::resource('shifts',ShiftController::class);

Route::get('Administration',function(){
return Inertia::render('Administration');
})->name('administration');

Route::get('Restaurant', function(){
    $restaurants = Restaurant::all();

    return Inertia::render('Restaurant', [
        'restaurants' => $restaurants]);
})->name('restaurant');