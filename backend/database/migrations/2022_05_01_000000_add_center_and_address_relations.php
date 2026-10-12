<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCenterAndAddressRelations extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('address_id')->nullable();
        });

        Schema::table('centers', function (Blueprint $table) {
            $table->unsignedInteger('address_id')->nullable();
        });

        Schema::create('center_user', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('center_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('center_user');
        Schema::table('centers', function (Blueprint $table) {
            $table->dropColumn('address_id');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('address_id');
        });
    }
}
