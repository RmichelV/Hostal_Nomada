<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $table = 'employees';
    protected $fillable = [
        'user_id',
        'shift_id',
        'hire_date',
        'salary'
    ];

    public function user (){
        return $this->belongsTo(User::class, 'user_id','id');
    }
    public function shift (){
        return $this->belongsTo(Shift::class, 'shift_id','id');
    }

    public function rol()
    {
        return $this->hasOneThrough(Rol::class, User::class, 'id', 'id', 'user_id', 'rol_id');
    }

    public $timestamp = true;
}
