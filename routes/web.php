<?php

use App\Http\Controllers\Api\EmployeeController as ApiEmployeeController;
use App\Http\Controllers\Api\ReservationController as ApiReservationController;
use App\Http\Controllers\Api\RestaurantDishController as ApiRestaurantDishController;
use App\Http\Controllers\Api\RoomController as ApiRoomController;
use App\Http\Controllers\Api\RoomTypeController as ApiRoomTypeController;
use App\Http\Controllers\Api\SupplyController as ApiSupplyController;
use App\Http\Controllers\Api\UserController as ApiUserController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RestaurantDishController;
use App\Http\Controllers\RestaurantHomeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/api/roomtypes', [ApiRoomController::class, 'index']);
Route::get('api/restaurant_dishes', [ApiRestaurantDishController::class, 'index']);
Route::get('/restaurant', [RestaurantHomeController::class, 'showRestaurantPage'])->name('restaurant');



Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/reservation', [ReservationController::class, 'showReservationPage'])->name('reservation');
    Route::get('/reservationlist', [ReservationController::class, 'showReseListPage'])->name('reservationlist');
    Route::get('/room_type', [RoomTypeController::class, 'showRoomTypePage'])->name('room_type');
    Route::get('/room', [RoomController::class, 'showRoomPage'])->name('room');
    Route::get('/employee', [EmployeeController::class, 'showEmployeePage'])->name('employee');
    Route::get('/user', [UserController::class, 'showUserPage'])->name('user');
    Route::get('/dish', [DishController::class, 'showRestaurantPage'])->name('dish');
    Route::get('/supply', [SupplyController::class , 'showSupplyPage'])->name('supply');
    
    
    Route::apiResource('/api/employees', ApiEmployeeController::class);
    Route::apiResource('/api/users', ApiUserController::class);
    Route::apiResource('/api/reservations', ApiReservationController::class);

    Route::post('/api/roomtypes', [ApiRoomTypeController::class, 'store']);
        Route::put('/api/roomtypes/{roomType}', [ApiRoomTypeController::class, 'update']);
        Route::delete('/api/roomtypes/{roomType}', [ApiRoomTypeController::class, 'destroy']);

        Route::post('api/restaurant_dishes', [ApiRestaurantDishController::class, 'store']);
        Route::put('api/restaurant_dishes/{dish}', [ApiRestaurantDishController::class, 'update']);
        Route::delete('api/restaurant_dishes/{dish}', [ApiRestaurantDishController::class, 'destroy']);

        Route::post('api/supplies', [ApiSupplyController::class, 'store']);
        Route::put('api/supplies/{dish}', [RestaurantDishController::class, 'update']);
        Route::delete('api/supplies/{dish}', [RestaurantDishController::class, 'destroy']);

});
