<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nationality extends Model
{
    /** @use HasFactory<\Database\Factories\NationalityFactory> */
    use HasFactory;

    protected $table = 'nationalities';
    protected $primaryKey = 'id';
    protected $fillable = ['name'];
    public $timestamps=false;

    public function users(){
        return $this->hasMany( User::class, 'nationality_id', 'id');
    }
}
