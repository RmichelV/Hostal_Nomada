<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'number_of_rooms', 'number_of_people', 'res_date',
        'check_in', 'check_out', 'total_price', 'status', 'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'reservation_rooms');
    }

    // public function roomTypes()
    // {
    //     return $this->belongsToMany(RoomType::class, 'reservation_room_types')->withPivot('quantity');
    // }
    public function roomTypes()
    {
        return $this->belongsToMany(RoomType::class, 'reservation_room_types')
            ->withPivot('quantity') // Include quantity in the pivot table
            ->withTimestamps(); // Track creation and update timestamps for pivot
    }

    /**
     * Calculate the total price for the reservation based on room types and quantities.
     */
    public function calculateTotalPrice()
    {
        return $this->roomTypes->reduce(function ($total, $roomType) {
            return $total + ($roomType->price * $roomType->pivot->quantity);
        }, 0);
    }
}
