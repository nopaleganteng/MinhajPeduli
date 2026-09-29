<?php

/*
|--------------------------------------------------------------------------
| Rekening Yayasan (single source of truth)
|--------------------------------------------------------------------------
| Nomor rekening + nama pemilik yang tampil di halaman pembayaran diambil
| dari sini, agar tidak tercecer hardcoded di file JSX.
|
| QRIS: minta gambar QRIS resmi yayasan ke BTN Syariah, simpan sebagai
| public/images/qris-yayasan.png lalu isi 'qris_image' di bawah dengan
| '/images/qris-yayasan.png'. Selama null, blok QRIS disembunyikan
| otomatis dan donatur memakai transfer manual ke nomor rekening.
| Donatur yang scan QRIS via m-banking/e-wallet = dana langsung masuk
| ke rekening yayasan tanpa perantara.
*/

return [
    'bank_name' => 'BTN Syariah',
    'account_number' => '20022284222',
    'account_name' => 'Yayasan Minhajul Misbah Al Jadid',
    'qris_image' => null,
];
