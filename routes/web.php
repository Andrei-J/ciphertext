<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AutokeyCipherController;
use App\Http\Controllers\VigenereCipherController;
use App\Http\Controllers\CaesarCipherController;
use App\Http\Controllers\AffineCipherController;

Route::get('/', [AutokeyCipherController::class, 'Index'])
    ->name('home');
//Autokey
Route::get('/CipherText/AutoKey', [AutokeyCipherController::class, 'Index'])
    ->name('CipherText.AutoKey');

Route::get('/CipherText/AutoKey/about', [AutokeyCipherController::class, 'about'])
    ->name('CipherText.AutoKey.about');

//Vigenere
Route::get('/CipherText/Vigenere', [VigenereCipherController::class, 'Index'])
    ->name('CipherText.vigenere');
//Caecar
Route::get('/CipherText/Caesar', [CaesarCipherController::class, 'Index'])
    ->name('CipherText.caecar');

    //Affine
Route::get('/CipherText/Affine', [AffineCipherController::class, 'Index'])
    ->name('CipherText.affine');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
