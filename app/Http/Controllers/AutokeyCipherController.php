<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AutokeyCipherController extends Controller
{
    //Autokey
    public function Index(){
        return Inertia::render('CipherText/AutoKey/Index');
    }

    public function About(){
        return Inertia::render('CipherText/AutoKey/About');
    }
}
