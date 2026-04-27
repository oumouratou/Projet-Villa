<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
        'address',
        'city',
        'postal_code',
        'price_per_night',
        'surface',
        'bedrooms',
        'bathrooms',
        'capacity',
        'status',
        'image_url',
        'agent_id',
    ];

    protected $appends = ['images'];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function options(): BelongsToMany
    {
        return $this->belongsToMany(PropertyOption::class);
    }

    public function propertyImages(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('order');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Accessor pour retourner les images de la relation ou fallback sur image_url
     */
    protected function images(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->relationLoaded('propertyImages') && $this->propertyImages->count() > 0) {
                    return $this->propertyImages->pluck('url')->toArray();
                }

                return $this->image_url ? [$this->image_url] : [];
            },
        );
    }
}
