<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'quantity', 'price', 'description', 'room_image'];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function supplies()
    {
        return $this->belongsToMany(Supply::class, 'room_type_supplies')->withPivot('quantity');
    }
}
