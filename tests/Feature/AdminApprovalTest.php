<?php

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

it('blocks pending admin login', function () {
    $admin = Admin::create([
        'name' => 'Pending Admin',
        'email' => 'pending@minhaj.com',
        'password' => 'secret123',
        'role' => 'admin',
        'status' => Admin::STATUS_PENDING,
    ]);

    $this->post(route('admin.login.post'), [
        'email' => $admin->email,
        'password' => 'secret123',
    ])
        ->assertSessionHasErrors(['email']);

    $this->assertGuest('admin');
});

it('allows approved admin login', function () {
    $admin = Admin::create([
        'name' => 'Approved Admin',
        'email' => 'approved@minhaj.com',
        'password' => 'secret123',
        'role' => 'admin',
        'status' => Admin::STATUS_APPROVED,
    ]);

    $this->post(route('admin.login.post'), [
        'email' => $admin->email,
        'password' => 'secret123',
    ])->assertRedirect(route('admin.dashboard', absolute: false));

    $this->assertAuthenticatedAs($admin, 'admin');
});
