<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class CaesarCipherController extends Controller
{
    public function Index(){
        return Inertia::render('CipherText/Caesar/Index');
    }
}
