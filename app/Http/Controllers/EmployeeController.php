<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Shift;
use App\Models\User;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function showEmployeePage()
    {
        $employees = Employee::where('isDeleted', 0)
        ->whereHas('user', function ($query) {
            $query->where('isDeleted', 0);
        })
        ->with(['user:id,name', 'shift:id,name'])
        ->get();
        $activeEmployeeUserIds = Employee::where('isDeleted', 0)->pluck('user_id');

        $users = User::where('isDeleted', 0)
            ->where('rol_id', '!=', 2)
            ->whereNotIn('id', $activeEmployeeUserIds)
            ->get();
                $shifts = Shift::all();

        return Inertia::render('Employee/Employee', [
            'employees' => $employees,
            'users' => $users,
            'shifts' => $shifts,
        ]);
    }
}
