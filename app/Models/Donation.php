<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    /**
     * Daftar kolom yang bisa diisi (Mass Assignable).
     * Menambahkan 'is_paid' dan 'amount' agar sinkron dengan Accessor di Program.php
     */
    protected $fillable = [
        'program_id',
        'invoice_no',       // Nomor Invoice (contoh: INV-2023001)
        'name',             // Nama Donatur
        'email',            // Email Donatur
        'phone',            // WhatsApp Donatur
        'notes',            // Doa atau Catatan
        'nominal',          // Jumlah Donasi utama
        'amount',           // Alias/Tambahan untuk perhitungan sum (agar cocok dengan logic Program)
        'unique_code',      // Kode unik (1-999)
        'status',           // Status: 'pending', 'paid', 'failed'
        'proof_image',      // Path gambar bukti pembayaran (dipakai DonationController)
        'is_paid',          // Boolean untuk logic accessor di Program.php
        'payment_method',   // Bank Transfer, QRIS, dll
        'proof_of_payment'  // Path gambar bukti transfer
    ];

    /**
     * Casting tipe data agar aman saat diolah.
     */
    protected $casts = [
        'nominal' => 'integer',
        'amount' => 'integer',
        'unique_code' => 'integer',
        'program_id' => 'integer',
        'is_paid' => 'boolean', // Memastikan is_paid dibaca sebagai true/false
    ];

    /**
     * RELASI DATABASE
     * Satu donasi terhubung ke satu program.
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
