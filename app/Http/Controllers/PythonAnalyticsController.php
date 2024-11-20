<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PythonAnalyticsController extends Controller
{
    public function getForecast()
    {
        // Realiza una solicitud GET al endpoint de Flask
        $response = Http::get('http://localhost:5000/forecast');

        // Verifica si la solicitud fue exitosa
        if ($response->successful()) {
            // Obtiene el pronóstico de la respuesta de Flask
            $forecast = $response->json()['forecast'];
            
            // Devuelve el pronóstico como respuesta JSON en Laravel
            return response()->json(['forecast' => $forecast]);
        } else {
            // Manejo de error en caso de que la solicitud falle
            return response()->json(['error' => 'Error al obtener el pronóstico'], 500);
        }
    }
}
