<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'agent_id',
        'bien_immobilier_id',
        'date_debut',
        'date_fin',
        'statut',
        'commentaire_agent',
        'guest_name',
        'guest_email',
        'guest_phone',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function bien()
    {
        return $this->belongsTo(BienImmobilier::class);
    }
}
