<?php

namespace App\Notifications;

use App\Models\Reclamation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReclamationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Reclamation $reclamation) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $status = $this->reclamation->statut ?? 'en_attente';
        $subject = $this->reclamation->sujet ?? 'Réclamation';

        $statusText = match ($status) {
            'approuver' => 'approuvée',
            'refuser'   => 'refusée',
            default     => 'mise à jour',
        };

        return [
            'reclamation_id' => $this->reclamation->id,
            'type' => 'reclamation',
            'message' => "Votre réclamation « {$subject} » a été {$statusText}.",
            'status' => $status,
            'subject' => $subject,
        ];
    }
}
