<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class VigenereCipherController extends Controller
{
    public function Index(){
        return Inertia::render('CipherText/Vigenere/Index');
    }
}
