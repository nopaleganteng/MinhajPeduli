<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('admin can authenticate and is redirected to admin dashboard', function () {
    $admin = \App\Models\Admin::create([
        'name' => 'Admin Test',
        'email' => 'admin@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post('/admin/login', [
        'email' => $admin->email,
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($admin, 'admin');
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});
