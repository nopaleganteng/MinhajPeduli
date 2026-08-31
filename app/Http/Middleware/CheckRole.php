<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $allowedRoles = array_values(array_filter($roles, fn ($role) => $role !== null && $role !== ''));

        if ($allowedRoles === []) {
            abort(403, 'Role tidak ditentukan.');
        }

        $user = $request->user();

        if (!$user || !in_array($user->role, $allowedRoles, true)) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
