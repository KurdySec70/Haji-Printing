<?php

namespace App\Models;

use App\Traits\HasImageUrl;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasImageUrl;

    protected $fillable = [
        'title',
        'description',
        'image_path',
    ];

    protected $appends = [
        'image_url',
    ];
}
