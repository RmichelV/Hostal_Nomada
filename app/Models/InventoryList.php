<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryList extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'supply_id', 'quantity', 'i_date', 'description'];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function supply()
    {
        return $this->belongsTo(Supply::class);
    }
}

