<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    /** @use HasFactory<\Database\Factories\RestaurantFactory> */
    use HasFactory;

    protected $table = 'restaurants';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'description',
        'food_image'
    ];

    public $timestamps = false;

}
