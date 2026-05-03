<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->nullable()->after('id');
            }
            if (! Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->nullable()->after('first_name');
            }
            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('actif')->after('phone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('users', 'first_name')) $cols[] = 'first_name';
            if (Schema::hasColumn('users', 'last_name'))  $cols[] = 'last_name';
            if (Schema::hasColumn('users', 'status'))     $cols[] = 'status';
            if ($cols) $table->dropColumn($cols);
        });
    }
};