<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Manejar la solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, int $role)
    {   
        $allowedRoles = explode(',', $role); // Divide los roles por comas en un array

        if (Auth::check() && in_array(Auth::user()->rol_id, $allowedRoles)) {
            return $next($request); // Permite el acceso
        }
        return redirect('/dashboard')->with('error', 'No tienes permisos para acceder a esta página.');
    }
}
