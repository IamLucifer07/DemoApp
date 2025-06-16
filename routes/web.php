<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('peg', function () {
    return Inertia::render('Peg');
})->middleware(['auth', 'verified']);


Route::get('cap', function () {
    return Inertia::render('Cap');
})->middleware(['auth', 'verified']);

Route::get('sectors', function () {
    return Inertia::render('Sectors');
})->middleware(['auth', 'verified']);

Route::get('reports', function () {
    return Inertia::render('Reports');
})->middleware(['auth', 'verified']);

Route::get('fundamentals', function () {
    return Inertia::render('fundamentals');
})->middleware(['auth', 'verified']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
