<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next, $rol_Id)
    // {
    //     // Verifica si el usuario está autenticado y si su rol coincide con el rol requerido
    //     if (!$request->user() || $request->user()->rol_id != $rol_Id) {
    //         abort(403, 'Acceso no autorizado.');
    //     }

    //     return $next($request);
    // }
}
