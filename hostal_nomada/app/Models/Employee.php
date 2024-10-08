<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'shift_id',
        'hiring_date'];
    
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
    
    public function salaries()
    {
        return $this->hasMany(Salary::class);
    }
}
