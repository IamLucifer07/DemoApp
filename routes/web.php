<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard (Inertia)
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Admin routes group (mix of Inertia and traditional views)
    Route::prefix('admin')->name('admin.')->group(function () {
        // Admin dashboard (traditional view)
        Route::get('/dashboard', function () {
            return view('admin.dashboard');
        })->middleware('permission:view dashboard')->name('dashboard');

        // Posts management (Inertia)
        Route::get('/posts', function () {
            return Inertia::render('Admin/Posts/Index');
        })->middleware('permission:manage posts')->name('posts.index');
    });
});

// Include auth and settings routes
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
