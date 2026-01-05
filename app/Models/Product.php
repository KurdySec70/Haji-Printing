<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'type',
        'width',
        'height'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2'
    ];

    /**
     * Get the width attribute with cm unit
     */
    public function getWidthAttribute($value)
    {
        return $value ? $value . ' cm' : null;
    }

    /**
     * Get the height attribute with cm unit
     */
    public function getHeightAttribute($value)
    {
        return $value ? $value . ' cm' : null;
    }

    /**
     * Set the width attribute, removing cm if present
     */
    public function setWidthAttribute($value)
    {
        if ($value) {
            // Remove 'cm' if present and trim whitespace
            $cleanValue = trim(str_replace('cm', '', $value));
            $this->attributes['width'] = is_numeric($cleanValue) ? $cleanValue : null;
        } else {
            $this->attributes['width'] = null;
        }
    }

    /**
     * Set the height attribute, removing cm if present
     */
    public function setHeightAttribute($value)
    {
        if ($value) {
            // Remove 'cm' if present and trim whitespace
            $cleanValue = trim(str_replace('cm', '', $value));
            $this->attributes['height'] = is_numeric($cleanValue) ? $cleanValue : null;
        } else {
            $this->attributes['height'] = null;
        }
    }
}
