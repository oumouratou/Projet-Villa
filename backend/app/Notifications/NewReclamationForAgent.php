<?php

namespace App\Notifications;

use App\Models\Reclamation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewReclamationForAgent extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Reclamation $reclamation) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $clientName = $this->reclamation->client?->user?->name
            ?? trim(($this->reclamation->client?->user?->first_name ?? '') . ' ' . ($this->reclamation->client?->user?->last_name ?? ''))
            ?: 'Un client';
        $subject = $this->reclamation->sujet ?? 'Réclamation';

        return [
            'reclamation_id' => $this->reclamation->id,
            'type' => 'reclamation',
            'message' => "Nouvelle réclamation de {$clientName} : {$subject}",
            'status' => $this->reclamation->statut,
            'subject' => $subject,
        ];
    }
}
