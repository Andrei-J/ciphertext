<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class AffineCipherController extends Controller
{
    public function Index(){
        return Inertia::render('CipherText/Affine/Index');
    }
}
