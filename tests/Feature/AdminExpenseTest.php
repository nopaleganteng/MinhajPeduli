<?php

use App\Models\Admin;

it('admin can create an expense and it appears in public financial report', function () {
    $admin = Admin::create([
        'name' => 'Admin Test',
        'email' => 'admin@test.com',
        'password' => bcrypt('password123'),
        'phone' => '081234567890',
    ]);

    $this->actingAs($admin, 'admin')
        ->post('/admin/expenses', [
            'title' => 'Pembelian ATK',
            'category' => 'operasional',
            'nominal' => 250000,
            'transaction_date' => '2026-08-31',
            'description' => 'Pembelian alat tulis kantor',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('expenses', [
        'title' => 'Pembelian ATK',
        'category' => 'operasional',
        'nominal' => 250000,
    ]);

    $this->get('/laporan')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('summary.total_keluar', 250000));
});
