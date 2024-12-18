<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    /** @use HasFactory<\Database\Factories\RolFactory> */
    use HasFactory;
    protected $table = 'rols';
    protected $primaryKey = 'id';
    protected $fillable = ['name'];
    public $timestamps=false;

    public function users(){
        return $this->hasMany( User::class, 'rol_id', 'id');
    }
}
