<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'ahmed',
            'email' => 'example@gmail.com',
            'username' => 'ahmed',
            'password' => Hash::make('ahmed123'),
            'role' => 'admin',
        ]);
    }
}
