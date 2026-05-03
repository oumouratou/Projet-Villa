<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add guest columns first (safe, additive)
        Schema::table('reservations', function (Blueprint $table) {
            if (! Schema::hasColumn('reservations', 'guest_name')) {
                $table->string('guest_name')->nullable()->after('client_id');
            }
            if (! Schema::hasColumn('reservations', 'guest_email')) {
                $table->string('guest_email')->nullable()->after('guest_name');
            }
            if (! Schema::hasColumn('reservations', 'guest_phone')) {
                $table->string('guest_phone')->nullable()->after('guest_email');
            }
        });

        // Make client_id nullable and change FK to SET NULL.
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            // Default FK name in Laravel: {table}_{column}_foreign
            DB::statement('ALTER TABLE reservations DROP FOREIGN KEY reservations_client_id_foreign');
            DB::statement('ALTER TABLE reservations MODIFY client_id BIGINT UNSIGNED NULL');
            DB::statement('ALTER TABLE reservations ADD CONSTRAINT reservations_client_id_foreign FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL');
        } elseif ($driver === 'sqlite') {
            // SQLite cannot ALTER COLUMN easily; rebuild table.
            DB::statement('PRAGMA foreign_keys=OFF');

            DB::statement('CREATE TABLE reservations__tmp (
                id integer primary key autoincrement,
                client_id integer null,
                guest_name varchar null,
                guest_email varchar null,
                guest_phone varchar null,
                bien_immobilier_id integer not null,
                date_debut date not null,
                date_fin date not null,
                statut varchar not null,
                commentaire_agent text null,
                created_at datetime null,
                updated_at datetime null,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
                FOREIGN KEY (bien_immobilier_id) REFERENCES bien_immobiliers(id) ON DELETE CASCADE
            )');

            DB::statement('INSERT INTO reservations__tmp (id, client_id, guest_name, guest_email, guest_phone, bien_immobilier_id, date_debut, date_fin, statut, commentaire_agent, created_at, updated_at)
                SELECT id, client_id, guest_name, guest_email, guest_phone, bien_immobilier_id, date_debut, date_fin, statut, commentaire_agent, created_at, updated_at
                FROM reservations');

            Schema::drop('reservations');
            DB::statement('ALTER TABLE reservations__tmp RENAME TO reservations');

            DB::statement('PRAGMA foreign_keys=ON');
        }
    }

    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE reservations DROP FOREIGN KEY reservations_client_id_foreign');
            DB::statement('ALTER TABLE reservations MODIFY client_id BIGINT UNSIGNED NOT NULL');
            DB::statement('ALTER TABLE reservations ADD CONSTRAINT reservations_client_id_foreign FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF');

            DB::statement('CREATE TABLE reservations__tmp (
                id integer primary key autoincrement,
                client_id integer not null,
                bien_immobilier_id integer not null,
                date_debut date not null,
                date_fin date not null,
                statut varchar not null,
                commentaire_agent text null,
                created_at datetime null,
                updated_at datetime null,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
                FOREIGN KEY (bien_immobilier_id) REFERENCES bien_immobiliers(id) ON DELETE CASCADE
            )');

            DB::statement('INSERT INTO reservations__tmp (id, client_id, bien_immobilier_id, date_debut, date_fin, statut, commentaire_agent, created_at, updated_at)
                SELECT id, client_id, bien_immobilier_id, date_debut, date_fin, statut, commentaire_agent, created_at, updated_at
                FROM reservations');

            Schema::drop('reservations');
            DB::statement('ALTER TABLE reservations__tmp RENAME TO reservations');

            DB::statement('PRAGMA foreign_keys=ON');

            return;
        }

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'guest_name')) {
                $table->dropColumn('guest_name');
            }
            if (Schema::hasColumn('reservations', 'guest_email')) {
                $table->dropColumn('guest_email');
            }
            if (Schema::hasColumn('reservations', 'guest_phone')) {
                $table->dropColumn('guest_phone');
            }
        });
    }
};
