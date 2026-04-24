<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gender extends Model
{
    use HasFactory;

    protected $table = 'tbl_genders';    
    protected $primaryKey = 'gender_id';
    public $incrementing = true;
    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'gender',
        'is_deleted',
    ];

    protected $attributes = [
        'is_deleted' => 0,
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'gender_id', 'gender_id');
    }
}