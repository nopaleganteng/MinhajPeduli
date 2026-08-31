<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'nominal',
        'transaction_date',
        'description',
    ];

    protected $casts = [
        'nominal' => 'integer',
        'transaction_date' => 'date',
    ];
}
