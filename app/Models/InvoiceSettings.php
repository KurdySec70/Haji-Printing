<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceSettings extends Model
{
    protected $table = 'invoice_settings';
    
    protected $fillable = [
        'header_color', 'footer_color', 'table_header_color',
        'primary_font', 'font_size_base', 'font_weight',
        'logo_url', 'logo_width', 'logo_height',
        'company_title', 'company_name', 'company_address',
        'company_phone_1', 'company_phone_2', 'company_email', 'company_website',
        'header_height', 'footer_height',
        'show_logo', 'show_company_info', 'show_date_time'
    ];
    
    protected $casts = [
        'show_logo' => 'boolean',
        'show_company_info' => 'boolean',
        'show_date_time' => 'boolean',
    ];
    
    public static function getSettings()
    {
        return self::firstOrCreate([]);
    }
}
