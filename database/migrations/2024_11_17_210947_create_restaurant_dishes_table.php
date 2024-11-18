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
        Schema::create('restaurant_dishes', function (Blueprint $table) {
            $table->id();
            $table->string('dishname',25)->nullable(false);
            $table->string('description',55);
            $table->deCimal('price',10,2)->nullable()->default(1);
            $table->string('dish_image',300)->nullable();  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_dishes');
    }
};
