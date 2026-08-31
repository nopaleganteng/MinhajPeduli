<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Silakan login terlebih dahulu.',
            ]);
        }

        if (!$user->isAdmin()) {
            Auth::logout();

            return redirect()->route('admin.login')->withErrors([
                'email' => 'Anda tidak memiliki akses admin.',
            ]);
        }

        if (!$user->isApproved()) {
            Auth::guard('admin')->logout();

            return redirect()->route('admin.login')->withErrors([
                'email' => 'Akun admin Anda masih menunggu persetujuan Super Admin.',
            ]);
        }

        return $next($request);
    }
}
