<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessSettings extends Model
{
    protected $fillable = [
        'company_name',
        'company_slogan',
        'description',
        'primary_phone',
        'secondary_phone',
        'email',
        'address',
        'city',
        'country',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function getSettings()
    {
        return self::first() ?? new self([
            'company_name' => 'Haji Printing',
            'company_slogan' => 'Professional Printing Services',
            'description' => 'Transform your ideas into stunning prints with our cutting-edge technology and expert craftsmanship.',
            'primary_phone' => '7514463959',
            'secondary_phone' => '7514473959',
            'email' => 'info@hajiprinting.com',
            'address' => 'Erbil, Kurdistan Region',
            'city' => 'Erbil',
            'country' => 'Iraq',
        ]);
    }

    public static function updateSettings(array $data)
    {
        $settings = self::first();

        if ($settings) {
            $settings->update($data);
            return $settings;
        } else {
            return self::create($data);
        }
    }
}