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
        Schema::create('bien_immobiliers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->text('description');
            $table->string('address');
            $table->string('city');
            $table->decimal('price_per_night', 10, 2);
            $table->integer('surface');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('capacity');
            $table->string('status');
            $table->string('image_url')->nullable();
            $table->foreignId('agent_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bien_immobiliers');
    }
};
