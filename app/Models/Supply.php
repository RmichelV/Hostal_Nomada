<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supply extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'supply_image', 'icon', 'price'];

    public function roomTypes()
    {
        return $this->belongsToMany(RoomType::class, 'room_type_supplies')->withPivot('quantity');
    }

    public function inventory()
    {
        return $this->hasMany(InventoryList::class);
    }
}
