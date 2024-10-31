<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $table = 'reservations';
    protected $primaryKey = 'id';
    protected $fillable=[
        'user_id',
        'room_type_id',
        'number_of_rooms',
        'number_of_people',
        'check_in',
        'check_out',
        'total_price'
    ];

    public $timestamps = true;

    public function user (){
        return $this->belongsTo(User::class, 'user_id','id');
    }
    public function room_type (){
        return $this->belongsTo(Room_type::class, 'room_type_id','id');
    }
    
}
