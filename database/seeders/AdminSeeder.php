<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin; // Import Model Admin Anda
use Illuminate\Support\Facades\Hash; // Penting untuk mengenkripsi password

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Gunakan updateOrCreate agar seeder idempoten (aman dijalankan berulang)
        Admin::updateOrCreate(
            ['email' => 'admin@minhaj.com'],
            [
                'name' => 'Suhaeri',
                'password' => 'password',
                'role' => 'superadmin',
                'status' => 'approved',
                'email_verified_at' => now(),
            ]
        );

        // Anda bisa menambahkan admin lain jika perlu:
        // Admin::create([
        //     'name' => 'Marketing Admin',
        //     'email' => 'marketing@minhaj.com',
        //     'password' => Hash::make('rahasia'),
        // ]);
    }
}
