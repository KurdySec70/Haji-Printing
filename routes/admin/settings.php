<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin/settings')->name('admin.settings.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/settings/index');
    })->name('index');
});
