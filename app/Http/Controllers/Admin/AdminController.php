<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Donation;
use App\Models\Expense;
use App\Models\Program;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
// Tambahan Import untuk Update Password
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    private function programImageUrl(?string $imagePath): string
    {
        if (!$imagePath) {
            return '/images/default.png';
        }

        if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return $imagePath;
        }

        return asset('storage/' . ltrim($imagePath, '/'));
    }

    /**
     * Menampilkan Dashboard dengan Data Statistik Asli
     */
    public function dashboard()
    {
        $totalNominal = Donation::where('status', 'paid')->sum('nominal');
        $totalPengeluaran = Expense::sum('nominal');
        $saldoAkhir = $totalNominal - $totalPengeluaran;

        $stats = [
            'total_donation'    => 'Rp ' . number_format($totalNominal, 0, ',', '.'),
            'total_pengeluaran' => 'Rp ' . number_format($totalPengeluaran, 0, ',', '.'),
            'saldo_akhir'       => 'Rp ' . number_format($saldoAkhir, 0, ',', '.'),
            'need_verification' => Donation::where('status', 'pending')->count(),
            'total_donatur'     => Donation::where('status', 'paid')->distinct()->count('name'),
            'program_active'    => Program::count(),
        ];

        $recentDonations = Donation::with('program')
            ->where('status', 'paid')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($donation) {
                return [
                    'id'         => $donation->id,
                    'invoice_no' => $donation->invoice_no,
                    'name'       => $donation->name,
                    'nominal'    => $donation->nominal,
                    'amount'     => 'Rp ' . number_format($donation->nominal, 0, ',', '.'),
                    'program'    => $donation->program->title ?? '-',
                    'status'     => $donation->status,
                    'date'       => $donation->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentDonations' => $recentDonations
        ]);
    }

    /**
     * Menampilkan Detail Donasi Berdasarkan ID
     */
    public function showDonation($id)
    {
        $donation = Donation::with('program')->findOrFail($id);

        if ($donation->status !== 'paid') {
            return redirect()->route('admin.donations')
                ->with('error', 'Hanya donasi yang sudah terbayar yang dapat dilihat.');
        }

        return Inertia::render('Admin/DonasiDetail', [
            'donation' => [
                'id'          => $donation->id,
                'invoice_no'  => $donation->invoice_no,
                'name'        => $donation->name,
                'email'       => $donation->email,
                'phone'       => $donation->phone,
                'nominal'     => $donation->nominal,
                'unique_code' => $donation->unique_code,
                'amount'      => 'Rp ' . number_format($donation->nominal, 0, ',', '.'),
                'program'     => $donation->program,
                'status'      => $donation->status,
                'notes'       => $donation->notes,
                'date'        => $donation->created_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    /**
     * Memproses Tombol Terima/Tolak
     */
    public function updateDonationStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:paid,failed,pending'
        ]);

        $donation = Donation::findOrFail($id);
        $donation->update(['status' => $validated['status']]);

        if ($validated['status'] === 'paid') {
            return redirect()->route('admin.donations')
                ->with('success', 'Donasi telah ditandai sebagai PAID.');
        }

        return back()->with('success', 'Status donasi berhasil diperbarui.');
    }

    /**
     * Menampilkan Daftar Donasi dengan Fitur Filter
     */
    public function donations(Request $request)
    {
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pendingQuery = Donation::with('program')->where('status', 'pending');
        $paidQuery = Donation::with('program')->where('status', 'paid');

        if ($startDate && $endDate) {
            $pendingQuery->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            $paidQuery->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        }

        if ($sort === 'nominal') {
            $pendingQuery->orderBy('nominal', $direction);
            $paidQuery->orderBy('nominal', $direction);
        } else {
            $pendingQuery->latest();
            $paidQuery->latest();
        }

        // Ambil paginasi, lalu transform setiap item untuk menyertakan field `date` yang dipakai oleh frontend.
        $pending = $pendingQuery->paginate(10)->withQueryString();
        $paid = $paidQuery->paginate(10)->withQueryString();

        $pending->getCollection()->transform(function ($donation) {
            return [
                'id' => $donation->id,
                'invoice_no' => $donation->invoice_no,
                'name' => $donation->name,
                'phone' => $donation->phone,
                'program' => $donation->program ? ['title' => $donation->program->title] : null,
                'nominal' => $donation->nominal,
                'status' => $donation->status,
                'date' => $donation->created_at ? $donation->created_at->format('d/m/Y') : null,
            ];
        });

        $paid->getCollection()->transform(function ($donation) {
            return [
                'id' => $donation->id,
                'invoice_no' => $donation->invoice_no,
                'name' => $donation->name,
                'phone' => $donation->phone,
                'program' => $donation->program ? ['title' => $donation->program->title] : null,
                'nominal' => $donation->nominal,
                'status' => $donation->status,
                'date' => $donation->created_at ? $donation->created_at->format('d/m/Y') : null,
            ];
        });

        return Inertia::render('Admin/Donations', [
            'pendingDonations' => $pending,
            'paidDonations' => $paid,
            'filters' => $request->only(['sort', 'direction', 'tab', 'start_date', 'end_date'])
        ]);
    }

    /**
     * Memproses Update Profil Admin (Versi Stabil)
     */
    public function updateProfile(Request $request)
    {
        /** @var Admin $user */
        $user = Auth::user();

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
        ]);

        // Update data dasar
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;

        if ($request->hasFile('image')) {
            // Hapus foto lama jika ada di storage
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            // Simpan foto baru ke folder 'users' di disk public
            $user->image = $request->file('image')->store('users', 'public');
        }

        // Simpan semua perubahan ke database
        $user->save();

        // Kembali dengan pesan sukses, Inertia akan otomatis me-refresh data auth user di frontend
        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Memproses Update Password Admin
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'], // Memvalidasi password lama benar
            'password' => ['required', Password::defaults(), 'confirmed'], // Memvalidasi password baru & konfirmasi
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diubah.');
    }

    public function updateNominal(Request $request, $id)
    {
        $validated = $request->validate(['nominal' => 'required|numeric|min:1000']);
        $donation = Donation::findOrFail($id);
        $donation->nominal = intval($validated['nominal']);
        $donation->save();

        return redirect()->back()->with('success', 'Nominal donasi berhasil diperbarui');
    }

    public function exportDonations(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $status = $request->input('status', 'paid');

        $donations = Donation::where('status', $status);

        if ($startDate && $endDate) {
            $donations->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        }

        $donations = $donations->get();

        $csv = "Invoice No,Nama,Email,Telepon,Nominal,Status,Tanggal\n";
        foreach ($donations as $donation) {
            $csv .= "{$donation->invoice_no},{$donation->name},{$donation->email},{$donation->phone},{$donation->nominal},{$donation->status},{$donation->created_at->format('d/m/Y H:i')}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="donations-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Menampilkan Halaman Kelola Program dengan Data Statistik Database
     */
    public function programs()
    {
        $programs = Program::with(['donations' => function($query) {
            $query->where('status', 'paid');
        }])->get()->map(function ($program) {
            // Hitung total donasi terkumpul
            $collected = $program->donations->sum('nominal');
            $target = $program->target_amount;

            // Hitung persentase
            $percentage = $target > 0 ? min(100, round(($collected / $target) * 100)) : 0;

            return [
                'id' => $program->id,
                'title' => $program->title,
                'target' => $target,
                'target_formatted' => 'Rp ' . number_format($target, 0, ',', '.'),
                'collected' => $collected,
                'collected_formatted' => 'Rp ' . number_format($collected, 0, ',', '.'),
                'progress' => $percentage,
                'status' => 'Aktif', // Anda bisa menambah kolom status di database jika perlu
                'image' => $this->programImageUrl($program->image_path),
            ];
        });

        return Inertia::render('Admin/Program', [
            'programs' => $programs
        ]);
    }

    /**
     * Menyimpan Program Baru ke Database
     */
    public function storeProgram(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('programs', 'public');
        }

        Program::create([
            'title' => $validated['title'],
            'target_amount' => $validated['target_amount'],
            'image_path' => $imagePath,
            // Kita isi kedua kolom deskripsi dengan input yang sama sesuai kebutuhan database
            'desc_short' => $validated['description'],
            'desc_long'  => $validated['description'],
        ]);

        return redirect()->back()->with('success', 'Program berhasil ditambahkan!');
    }

    /**
     * Update Program Donasi
     */
    public function updateProgram(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required|string',
        ]);

        $program->title = $validated['title'];
        $program->target_amount = $validated['target_amount'];
        $program->desc_short = $validated['description'];
        $program->desc_long = $validated['description'];

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($program->image_path) {
                Storage::disk('public')->delete($program->image_path);
            }
            $program->image_path = $request->file('image')->store('programs', 'public');
        }

        $program->save();
        return redirect()->route('admin.programs')->with('success', 'Program berhasil diperbarui!');
    }

    public function expenses(Request $request)
    {
        $query = Expense::query();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('transaction_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('transaction_date', '<=', $request->end_date);
        }

        $sortBy = $request->input('sort_by', 'transaction_date');
        $direction = $request->input('direction', 'desc');

        if ($sortBy === 'nominal') {
            $query->orderBy('nominal', $direction);
        } else {
            $query->orderBy('transaction_date', $direction)->orderBy('created_at', $direction);
        }

        $expenses = $query->get()->map(fn ($expense) => [
            'id' => $expense->id,
            'title' => $expense->title,
            'category' => $expense->category,
            'nominal' => (int) $expense->nominal,
            'transaction_date' => $expense->transaction_date ? $expense->transaction_date->format('Y-m-d') : null,
            'description' => $expense->description,
        ]);

        return Inertia::render('Admin/Expenses', [
            'expenses' => $expenses,
            'filters' => $request->only(['category', 'start_date', 'end_date', 'sort_by', 'direction']),
        ]);
    }

    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'nominal' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        Expense::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'nominal' => (int) $validated['nominal'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('admin.expenses')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    public function updateExpense(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'nominal' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense = Expense::findOrFail($id);
        $expense->update([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'nominal' => (int) $validated['nominal'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('admin.expenses')->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    public function destroyExpense($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return redirect()->route('admin.expenses')->with('success', 'Pengeluaran berhasil dihapus.');
    }

    public function requestAccessForm()
    {
        return Inertia::render('Admin/RequestAccess');
    }

    public function storeRequestAccess(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'min:8', 'confirmed'],
            'role' => 'nullable|in:admin,superadmin',
        ]);

        Admin::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'admin',
            'status' => Admin::STATUS_PENDING,
        ]);

        return redirect()->route('admin.login')->with('success', 'Pengajuan admin berhasil dikirim. Tunggu persetujuan Super Admin.');
    }

    public function users()
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat mengelola akun admin.');

        $users = Admin::orderBy('created_at', 'desc')->get()->map(function ($admin) {
            return [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'role' => $admin->role ?? 'admin',
                'status' => $admin->status ?? Admin::STATUS_APPROVED,
                'created_at' => $admin->created_at ? $admin->created_at->format('d M Y') : null,
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function storeUser(Request $request)
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat menambah admin.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => ['required', 'min:8', 'confirmed'],
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,superadmin',
        ]);

        Admin::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'status' => Admin::STATUS_APPROVED,
        ]);

        return redirect()->route('admin.users')->with('success', 'Admin baru berhasil ditambahkan.');
    }

    public function updateUser(Request $request, $id)
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat mengubah akun admin.');

        $user = Admin::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,superadmin',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->role = $validated['role'];
        $user->save();

        return redirect()->route('admin.users')->with('success', 'Data admin berhasil diperbarui.');
    }

    public function destroyUser($id)
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat menghapus akun admin.');

        $user = Admin::findOrFail($id);

        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Admin berhasil dihapus.');
    }

    public function approveUser($id)
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat menyetujui akun admin.');

        $user = Admin::findOrFail($id);
        $user->status = Admin::STATUS_APPROVED;
        $user->save();

        return redirect()->route('admin.users')->with('success', 'Akun admin berhasil disetujui.');
    }

    public function rejectUser($id)
    {
        abort_unless(Auth::user()?->canManageUsers(), 403, 'Hanya superadmin yang dapat menolak akun admin.');

        $user = Admin::findOrFail($id);
        $user->status = Admin::STATUS_REJECTED;
        $user->save();

        return redirect()->route('admin.users')->with('success', 'Akun admin berhasil ditolak.');
    }

    public function donatur() { return Inertia::render('Admin/Donatur'); }
    public function settings() { return Inertia::render('Admin/Settings'); }

    // --- FITUR BARU: EDIT & HAPUS PROGRAM ---

    public function editProgram($id) {
        $program = Program::findOrFail($id);
        return Inertia::render('Admin/EditProgram', ['program' => $program]);
    }

    public function destroyProgram($id) {
        $program = Program::findOrFail($id);

        // Opsional: Hapus gambar dari storage jika ada
        if ($program->image_path) {
            Storage::disk('public')->delete($program->image_path);
        }

        $program->delete();
        return redirect()->back()->with('success', 'Program berhasil dihapus');
    }
}
