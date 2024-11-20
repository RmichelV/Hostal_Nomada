<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestaurantDish extends Model
{
    use HasFactory;

    protected $fillable = ['dishname', 'description', 'price', 'dish_image'];
}

