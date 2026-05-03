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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('bien_immobilier_id')->constrained()->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('statut');
            $table->text('commentaire_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
