<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('agent_id')->nullable()->after('total_price')->constrained('users')->nullOnDelete();
        });

        Schema::table('complaints', function (Blueprint $table) {
            $table->foreignId('agent_id')->nullable()->after('agent_response')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agent_id');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agent_id');
        });
    }
};
