<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{ // <--- Added opening brace
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_genders', function (Blueprint $table) {
            $table->id('gender_id');
            $table->string('gender');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();
        });
    } // <--- Added closing brace for up()

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        
        Schema::dropIfExists('users'); 
        Schema::dropIfExists('tbl_users');
        Schema::dropIfExists('tbl_genders');
        
        Schema::enableForeignKeyConstraints();
    }
}; // <--- Added closing brace for class