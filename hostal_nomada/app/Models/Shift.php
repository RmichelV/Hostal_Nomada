<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    /** @use HasFactory<\Database\Factories\ShiftFactory> */
    use HasFactory;

    protected $table = 'shifts';
    protected $primaryKey = 'id';
    protected $fillable = ['name'];
    public $timestamps=false;

    public function employee(){
        return $this->hasMany( Employee::class, 'shift_id', 'id');
    }
}
