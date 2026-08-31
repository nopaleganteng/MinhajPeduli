<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Program;
use App\Models\Donation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage; // Tambahkan ini untuk handle Storage

class DonationController extends Controller
{
    private function programImageUrl(?string $imagePath): string
    {
        if (!$imagePath) {
            return asset('images/default.png');
        }

        if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return $imagePath;
        }

        return asset('storage/' . ltrim($imagePath, '/'));
    }

    public function index()
    {
        $programs = Program::with('donations')->get()->map(function ($program) {
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
                'image_path' => $this->programImageUrl($program->image_path),
            ];
        });

        $totalCollectedAmount = $programs->sum('collected_amount');
        $totalDonaturCount = Donation::where('status', 'paid')->distinct('name')->count();

        $totalStats = [
            'program_count' => $programs->count(),
            'collected_amount' => $totalCollectedAmount,
            'total_donatur' => $totalDonaturCount,
        ];

        return Inertia::render('Donasi', [
            'allPrograms' => $programs,
            'totalStats' => $totalStats,
            'auth' => Auth::user() ? ['user' => Auth::user()] : null,
        ]);
    }

    public function show($id)
    {
        $program = Program::findOrFail($id);

        $collected_amount = $program->donations->where('status', 'paid')->sum('nominal');
        $target_amount = $program->target_amount;

        $percentage = 0;
        if ($target_amount > 0) {
            $percentage = min(100, round(($collected_amount / $target_amount) * 100));
        }

        $programData = [
            'id' => $program->id,
            'title' => $program->title,
            'desc_short' => $program->desc_short,
            'desc_long' => $program->desc_long,
            'target_amount' => $program->target_amount,
            'collected_amount' => $collected_amount,
            'percentage' => $percentage,
            'image_path' => $this->programImageUrl($program->image_path),
        ];

        return Inertia::render('DetailDonasi', [
            'program' => $programData,
        ]);
    }

    public function storeDonation(Request $request, $programId)
    {
        $validatedData = $request->validate([

            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
            'nominal' => 'required|numeric|min:10000',
        ]);

        $uniqueCode = rand(1, 999);
        $invoiceNo = 'MM' . now()->format('Ymd') . Str::random(5);

        $donation = Donation::create([
            'program_id' => $programId,
            'invoice_no' => $invoiceNo,
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'notes' => $validatedData['notes'],
            'nominal' => $validatedData['nominal'],
            'unique_code' => $uniqueCode,
            'status' => 'pending',
        ]);

        // Redirect ke halaman pembayaran dengan data donasi
        return Inertia::render('PembayaranDonasi', [
            'id' => $programId,
            'donationData' => [
                'id' => $donation->id,
                'name' => $donation->name,
                'email' => $donation->email,
                'phone' => $donation->phone,
                'nominal' => $donation->nominal,
                'unique_code' => $donation->unique_code,
                'invoice_no' => $donation->invoice_no,
            ],
        ]);
    }
public function paymentForm(Request $request, $programId)
{
    $donationId = $request->query('donation_id');

    if (!$donationId) {
        abort(404, 'Donation ID missing');
    }

    $donation = Donation::findOrFail($donationId);

    return Inertia::render('KonfirmasiPembayaran', [
        'id' => $programId,
        'donation_id' => $donation->id, // ✅ WAJIB
        'data' => [
            'name' => $donation->name,
            'email' => $donation->email,
            'phone' => $donation->phone,
            'nominal' => $donation->nominal,
            'unique_code_number' => $donation->unique_code,
            'invoice_no' => $donation->invoice_no,
        ],
    ]);
}



    public function accept($id)
    {
        $donation = Donation::findOrFail($id);

        $donation->update([
            'status' => 'success'
        ]);

        return redirect()->back()->with('success', 'Donasi berhasil diterima!');
    }

    /** * Memproses Update Program dengan Sistem Storage yang Benar
     */
    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);

        $request->validate([
            'target_amount' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        $program->target_amount = $request->target_amount;

        if ($request->hasFile('image')) {
            // Hapus gambar lama dari storage jika ada
            if ($program->image_path) {
                Storage::disk('public')->delete($program->image_path);
            }

            // Simpan ke storage (disk public) agar sama dengan AdminController
            $path = $request->file('image')->store('programs', 'public');
            $program->image_path = $path;
        }

        $program->save();
        return redirect()->back()->with('success', 'Program berhasil diperbarui');
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);

        // Hapus file gambar dari storage
        if ($program->image_path) {
            Storage::disk('public')->delete($program->image_path);
        }

        $program->delete();

        return redirect()->route('donasi')->with('success', 'Program berhasil dihapus');
    }

    // --- FUNGSI TAMBAHAN UNTUK UPDATE BUKTI PEMBAYARAN (ADMIN) ---
    public function updateProof(Request $request, Donation $donation)
    {
        $request->validate([
            'proof_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('proof_image')) {
            // Hapus foto lama jika ada
            if ($donation->proof_image) {
                Storage::disk('public')->delete($donation->proof_image);
            }

            // Simpan foto baru
            $path = $request->file('proof_image')->store('proofs', 'public');
            $donation->update(['proof_image' => $path]);
        }

        return back()->with('success', 'Bukti berhasil diupdate');
    }

    // --- FUNGSI UNTUK MENAMPILKAN DETAIL DONASI DI HALAMAN ADMIN ---
    public function showDonation($id)
    {
        $donation = Donation::with('program')->findOrFail($id);

        return Inertia::render('Admin/DonasiDetail', [
            'donation' => [
                'id' => $donation->id,
                'invoice_no' => $donation->invoice_no,
                'status' => $donation->status,
                'nominal' => $donation->nominal,
                'name' => $donation->name,
                'email' => $donation->email,
                'phone' => $donation->phone,
                'notes' => $donation->notes,
                'program_name' => $donation->program->title,
                'created_at' => $donation->created_at->format('d/m/Y H:i'),
                // Logika menampilkan bukti: Jika ada tampilkan URL-nya, jika tidak null
                'proof_image' => $donation->proof_image ? asset('storage/' . $donation->proof_image) : null,
            ]
        ]);
    }

    /** * FUNGSI KONFIRMASI PEMBAYARAN (DONATUR)
     * Memproses upload bukti dari sisi publik/user
     */
    /**
     * FUNGSI KONFIRMASI PEMBAYARAN (DONATUR)
     * Memproses upload bukti dari sisi publik/user
     */
    public function confirm(Request $request)
    {
        // Validasi data yang masuk
        $request->validate([
            'donation_id' => 'required',
            'proof_image' => 'required|image', // Menghapus batasan max 2mb sesuai permintaan
            'bank_owner'  => 'required|string',
            'payment_date'=> 'required|date',
        ]);

        // Proses upload file
        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('payment_proofs', 'public');

            // Update data donasi
            $donation = Donation::findOrFail($request->donation_id);
            $donation->update([
                'status' => 'pending', // Menunggu verifikasi admin
                'proof_path' => $path,
                'bank_owner' => $request->bank_owner,
                'bank_name' => $request->bank_name,
                'payment_date' => $request->payment_date,
                'notes' => $request->notes,
            ]);

            return redirect()->back()->with('success', 'Konfirmasi berhasil dikirim.');
        }

        return redirect()->back()->withErrors(['proof_image' => 'Gagal mengunggah gambar.']);
    }

    /**
     * Menampilkan halaman konfirmasi pembayaran manual (form upload bukti transfer)
     */
    public function konfirmasiManual($donationId)
    {
        $donation = Donation::findOrFail($donationId);

        return Inertia::render('KonfirmasiPembayaran', [
            'data' => [
                'id' => $donation->id,
                'name' => $donation->name,
                'email' => $donation->email,
                'phone' => $donation->phone,
                'nominal' => $donation->nominal,
                'unique_code_number' => $donation->unique_code,
                'invoice_no' => $donation->invoice_no,
                // tambahkan field lain jika perlu
            ],
            // 'donation_id' => $donation->id, // opsional, untuk fallback
        ]);
    }
}
