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
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            // On lie la réclamation au client (table 'clients' ou 'users' selon ta structure)
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            
            // On lie éventuellement à une réservation
            $table->foreignId('reservation_id')->nullable()->constrained('reservations')->nullOnDelete();
            
            // On lie à l'agent qui traite la réclamation (table 'users')
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('sujet');
            $table->text('message');
            $table->string('statut')->default('en_attente'); // Ajout d'une valeur par défaut
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamations');
    }
};