<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InvoiceSettings;

class InvoiceSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InvoiceSettings::create([
            'header_color' => '#f97316',
            'footer_color' => '#f97316',
            'table_header_color' => '#f97316',
            'primary_font' => 'Arial',
            'font_size_base' => 12,
            'font_weight' => '400',
            'logo_width' => 90,
            'logo_height' => 90,
            'logo_url' => null,
            'company_title' => 'INVOICE',
            'company_name' => 'Haji Printing',
            'company_address' => 'Erbil-Ehsa Street, Near Sarhad Stationery',
            'company_phone_1' => '0751 446 39 59',
            'company_phone_2' => '0751 447 39 59',
            'company_email' => 'info@hajiprinting.com',
            'company_website' => 'www.hajiprinting.com',
            'header_height' => 60,
            'footer_height' => 40,
            'show_logo' => true,
            'show_company_info' => true,
            'show_date_time' => true
        ]);
    }
}
