<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 'last_name', 'name',
        'email', 'password', 'phone', 'status',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function client(): HasOne { return $this->hasOne(Client::class); }
    public function roles() { return $this->belongsToMany(Role::class); }
    public function biens() { return $this->hasMany(BienImmobilier::class, 'agent_id'); }
}