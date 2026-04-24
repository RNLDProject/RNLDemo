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
        if (!Schema::hasTable('users')) {
            return;
        }

        if (Schema::hasColumn('users', 'gender')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('gender');
            });
        }

        if (!Schema::hasColumn('users', 'gender_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('gender_id')
                    ->nullable()
                    ->constrained('tbl_genders', 'gender_id')
                    ->nullOnDelete()
                    ->after('password');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        if (Schema::hasColumn('users', 'gender_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['gender_id']);
                $table->dropColumn('gender_id');
            });
        }

        if (!Schema::hasColumn('users', 'gender')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('gender')->nullable()->after('password');
            });
        }
    }
};
