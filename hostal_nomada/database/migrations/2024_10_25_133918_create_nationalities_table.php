<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nationalities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        DB::table('nationalities')->insert([
            ['name' => 'Afgana'],
            ['name' => 'Alemana'],
            ['name' => 'Argentina'],
            ['name' => 'Australiana'],
            ['name' => 'Boliviana'],
            ['name' => 'Brasileña'],
            ['name' => 'Canadiense'],
            ['name' => 'Chilena'],
            ['name' => 'China'],
            ['name' => 'Colombiana'],
            ['name' => 'Surcoreana'],
            ['name' => 'Cubana'],
            ['name' => 'Danesa'],
            ['name' => 'Ecuatoriana'],
            ['name' => 'Egipcia'],
            ['name' => 'Española'],
            ['name' => 'Estadounidense'],
            ['name' => 'Francesa'],
            ['name' => 'India'],
            ['name' => 'Italiana'],
            ['name' => 'Japonesa'],
            ['name' => 'Mexicana'],
            ['name' => 'Noruega'],
            ['name' => 'Peruana'],
            ['name' => 'Británica'],
            ['name' => 'Rusa'],
            ['name' => 'Sueca'],
            ['name' => 'Suiza'],
            ['name' => 'Uruguaya'],
            ['name' => 'Venezolana'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nationalities');
    }
};
