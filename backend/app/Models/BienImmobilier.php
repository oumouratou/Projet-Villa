<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BienImmobilier extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
        'address',
        'city',
        'price_per_night',
        'surface',
        'bedrooms',
        'bathrooms',
        'capacity',
        'status',
        'image_url',
        'agent_id',
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function options()
    {
        return $this->belongsToMany(Option::class, 'bien_option');
    }
}
