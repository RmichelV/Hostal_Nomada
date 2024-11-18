<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function showUserPage()
    {
        $users=User::where('isDeleted', 0)
            ->with(['rol:id,name', 'country:id,name'])
            ->get();
        $countries = Country::all();
        $rols = Rol::all();

        return Inertia::render('User/User', [
            'users' => $users,
            'rols' => $rols,
            'countries' => $countries,
        ]);
    }
}