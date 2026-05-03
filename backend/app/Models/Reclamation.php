<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'reservation_id',
        'agent_id',
        'sujet',
        'message',
        'statut',
        'agent_response',
    ];

    public function getSubjectAttribute(): ?string { return $this->attributes['sujet'] ?? null; }
    public function setSubjectAttribute($value): void { $this->attributes['sujet'] = $value; }
    public function getDescriptionAttribute(): ?string { return $this->attributes['message'] ?? null; }
    public function setDescriptionAttribute($value): void { $this->attributes['message'] = $value; }

    public function client() { return $this->belongsTo(Client::class); }
    public function reservation() { return $this->belongsTo(Reservation::class); }
    public function agent() { return $this->belongsTo(User::class, 'agent_id'); }
}