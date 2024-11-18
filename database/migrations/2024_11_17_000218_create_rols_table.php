<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rols', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->nullable(false);
            $table->timestamps();
        });
        DB::table('rols')->insert([
            ['name' => 'Administrador'],
            ['name' => 'Administrador-Restaurante'],
            ['name' => 'Cliente'],
            ['name' => 'Cocinero'],
            ['name' => 'Contador'],
            ['name' => 'Gerente'],
            ['name' => 'Limpieza'],
            ['name' => 'Mantenimiento'],
            ['name' => 'Recepcionista'],
            ['name' => 'Seguridad'],
            ['name' => 'Supervisor'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rols');
    }
};
