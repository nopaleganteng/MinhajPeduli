<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\DonationController;
use App\Models\Program;
use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes (USER / PUBLIK)
|--------------------------------------------------------------------------
*/

// Halaman Beranda (Welcome)
Route::get('/', function () {
    $programs = Program::with('donations')
        ->orderBy('id', 'asc')
        ->get()
        ->map(function ($program) {
            $collected_amount = $program->donations->where('status', 'paid')->sum('nominal');
            $target_amount = $program->target_amount;

            $percentage = 0;
            if ($target_amount > 0) {
                $percentage = min(100, round(($collected_amount / $target_amount) * 100));
            }

            return [
                'id' => $program->id,
                'title' => $program->title,
                'target_amount' => $target_amount,
                'collected_amount' => $collected_amount,
                'percentage' => $percentage,
                'image_path' => $program->image_path ? (str_starts_with(ltrim($program->image_path, '/'), 'images/') ? asset(ltrim($program->image_path, '/')) : asset('storage/' . ltrim($program->image_path, '/'))) : asset('images/default.png'),
            ];
        });

    $totalCollectedAmount = Donation::where('status', 'paid')->sum('nominal');
    $totalDonaturCount = Donation::where('status', 'paid')->distinct('name')->count();
    $totalProgramCount = Program::count();

    $totalStats = [
        'program_count' => $totalProgramCount,
        'collected_amount' => $totalCollectedAmount,
        'total_donatur' => $totalDonaturCount,
    ];

    return Inertia::render('Welcome', [
        'programsData' => $programs,
        'totalStats' => $totalStats,
        'auth' => Auth::user() ? ['user' => Auth::user()] : null,
    ]);
})->name('welcome');

// Halaman Tentang
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Halaman Laporan
Route::get('/laporan', function () {
    $total_masuk = Donation::where('status', 'paid')->sum('nominal');
    $total_keluar = Expense::sum('nominal');
    $saldo_akhir = $total_masuk - $total_keluar;

    $donasiMutasi = Donation::where('status', 'paid')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($d) {
            return [
                'id' => 'donasi-' . $d->id,
                'tanggal' => $d->created_at->format('d M Y'),
                'uraian' => 'Donasi - ' . ($d->name ?: 'Anonim') . ' (' . ($d->invoice_no ?? '-') . ')',
                'tipe' => 'masuk',
                'nominal' => (int) $d->nominal,
            ];
        });

    $pengeluaranMutasi = Expense::orderBy('transaction_date', 'desc')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($e) {
            return [
                'id' => 'expense-' . $e->id,
                'tanggal' => $e->transaction_date ? $e->transaction_date->format('d M Y') : date('d M Y'),
                'uraian' => $e->title,
                'tipe' => 'keluar',
                'nominal' => (int) $e->nominal,
            ];
        });

    $mutasi = $donasiMutasi->merge($pengeluaranMutasi)
        ->sortByDesc(function ($item) {
            return strtotime($item['tanggal']);
        })
        ->take(5)
        ->values();

    return Inertia::render('Laporan', [
        'summary' => [
            'total_masuk' => (int) $total_masuk,
            'total_keluar' => (int) $total_keluar,
            'saldo_akhir' => (int) $saldo_akhir,
        ],
        'mutasi' => $mutasi,
        'auth' => Auth::user() ? ['user' => Auth::user()] : null,
    ]);
})->name('laporan');

// Halaman List Donasi (INDEX)
Route::get('/donasi', [DonationController::class, 'index'])->name('donasi');

// =========================================================================
// RUTE TRANSAKSI DONASI
// =========================================================================

Route::get('/donasi/form/{id}/{nominal}', function ($id, $nominal) {
    $program = Program::find($id);
    if (!$program) {
        return redirect()->back()->with('error', 'Program tidak ditemukan');
    }

    $programData = [
        'id' => $program->id,
        'title' => $program->title,
        'img' => $program->image_path ? (str_starts_with(ltrim($program->image_path, '/'), 'images/') ? asset(ltrim($program->image_path, '/')) : asset('storage/' . ltrim($program->image_path, '/'))) : asset('images/default.png'),
    ];

    return inertia('FormDonasi', [
        'program_id' => $id,
        'program' => $programData,
        'nominal' => (int) $nominal,
    ]);
})->name('donasi.form');

Route::post('/donasi/{id}/store', [DonationController::class, 'storeDonation'])->name('donasi.store');

// Halaman pembayaran per donasi (GET, aman di-refresh) — ponytail: tanpa auth, siapa pun
// yang tahu donation id bisa melihatnya; kunci dengan token/cek email bila perlu privat.
Route::get('/donasi/bayar/{donation}', [DonationController::class, 'paymentPage'])->name('donasi.bayar');

Route::get('/donasi/{id}/pembayaran', [DonationController::class, 'paymentForm'])->name('donasi.pembayaran');

// Route GET untuk menampilkan halaman form konfirmasi (menggunakan donation ID)
Route::get('/donasi/{id}/konfirmasi', [DonationController::class, 'konfirmasiManual'])->name('donasi.konfirmasi');

// Route POST untuk memproses data konfirmasi (Submit Bukti Pembayaran)
Route::post('/donasi/konfirmasi-proses', [DonationController::class, 'confirm'])
    ->name('donasi.confirm');

// Rute Detail Donasi (Public)
Route::get('/donasi/{id}', [DonationController::class, 'show'])->name('donasi.show');


/*
|--------------------------------------------------------------------------
| Admin Routes (OTENTIKASI & DASHBOARD ADMIN)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'createAdmin'])->name('admin.login');
    Route::post('/login', [AuthenticatedSessionController::class, 'storeAdmin'])->name('admin.login.post');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroyAdmin'])->name('admin.logout');

    Route::get('/request', [AdminController::class, 'requestAccessForm'])->name('admin.request.form');
    Route::post('/request', [AdminController::class, 'storeRequestAccess'])->name('admin.request.store');

    Route::get('/forgot-password', [\App\Http\Controllers\Auth\PasswordResetLinkController::class, 'createAdmin'])->name('admin.password.request');
    Route::post('/forgot-password', [\App\Http\Controllers\Auth\PasswordResetLinkController::class, 'storeAdmin'])->name('admin.password.email');
    Route::get('/reset-password/{token}', [\App\Http\Controllers\Auth\NewPasswordController::class, 'createAdmin'])->name('admin.password.reset');
    Route::post('/reset-password', [\App\Http\Controllers\Auth\NewPasswordController::class, 'storeAdmin'])->name('admin.password.update');
});

// GROUP ADMIN (Membutuhkan Login)
Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::middleware('role:superadmin')->group(function () {
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{id}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{id}', [AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::post('/users/{id}/approve', [AdminController::class, 'approveUser'])->name('users.approve');
        Route::post('/users/{id}/reject', [AdminController::class, 'rejectUser'])->name('users.reject');
    });

    // --- RUTE PROGRAM ---
    Route::get('/programs/{id}/edit', [AdminController::class, 'editProgram'])->name('donasi.edit');
    Route::put('/programs/{id}', [AdminController::class, 'updateProgram'])->name('programs.update');
    Route::delete('/programs/{id}', [AdminController::class, 'destroyProgram'])->name('donasi.destroy');
    Route::post('/programs', [AdminController::class, 'storeProgram'])->name('programs.store');
    Route::get('/programs', [AdminController::class, 'programs'])->name('programs');

    // --- EXPENSES / LAPORAN KEUANGAN ---
    Route::get('/expenses', [AdminController::class, 'expenses'])->name('expenses');
    Route::post('/expenses', [AdminController::class, 'storeExpense'])->name('expenses.store');
    Route::put('/expenses/{id}', [AdminController::class, 'updateExpense'])->name('expenses.update');
    Route::delete('/expenses/{id}', [AdminController::class, 'destroyExpense'])->name('expenses.destroy');

    // --- DASHBOARD & DONATIONS ---
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/donations', [AdminController::class, 'donations'])->name('donations');
    Route::get('/donations/export', [AdminController::class, 'exportDonations'])->name('donations.export');

    // 1. Rute Detail Donasi
    Route::get('/donations/{id}', [DonationController::class, 'showDonation'])->name('donations.show');

    // 2. Update Status & Nominal
    Route::post('/donations/{id}/update-status', [AdminController::class, 'updateDonationStatus'])->name('donations.update-status');
    Route::post('/donations/{id}/update-nominal', [AdminController::class, 'updateNominal'])->name('donations.update-nominal');

    // 3. Update Bukti Pembayaran
    Route::put('/donations/{id}/update-proof', [DonationController::class, 'updateProof'])->name('donations.update-proof');

    // --- SETTINGS & DONATUR ---
    Route::get('/donatur', [AdminController::class, 'donatur'])->name('donatur');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::put('/settings/profile', [AdminController::class, 'updateProfile'])->name('settings.update-profile');
    Route::put('/settings/password', [AdminController::class, 'updatePassword'])->name('settings.update-password');
});

// Auth Routes (User Biasa / Donatur)
require __DIR__.'/auth.php';

// DINONAKTIFKAN (bukan dihapus): halaman auth user dialihkan ke alur admin
// Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');
// Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
// Route::get('/forgot-password', fn () => Inertia::render('Auth/ForgotPassword', ['status' => session('status')]))->name('password.request');
Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');
Route::get('/register', fn () => redirect()->route('admin.login'))->name('register');
Route::get('/forgot-password', fn () => redirect()->route('admin.password.request'))->name('password.request');
