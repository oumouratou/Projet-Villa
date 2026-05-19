<?php

namespace App\Notifications;

use App\Models\Reclamation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReclamationResponseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Reclamation $reclamation) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toArray(object $notifiable): array
    {
        $subject = $this->reclamation->sujet ?? 'Réclamation';
        return [
            'reclamation_id' => $this->reclamation->id,
            'type' => 'reclamation',
            'message' => 'Nouvelle réponse à votre réclamation : ' . $subject,
            'subject' => $subject,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject  = $this->reclamation->sujet ?? 'votre réclamation';
        $response = $this->reclamation->agent_response ?? '';

        return (new MailMessage)
            ->subject('Réponse à votre réclamation — ImmoGestion')
            ->greeting('Bonjour ' . ($notifiable->first_name ?? $notifiable->name) . ',')
            ->line('Un agent a répondu à votre réclamation concernant : **' . $subject . '**')
            ->line('---')
            ->line('**Réponse de l\'agent :**')
            ->line($response)
            ->line('---')
            ->action('Voir ma réclamation', url('/client/reclamations/' . $this->reclamation->id))
            ->line('Si vous avez d\'autres questions, n\'hésitez pas à nous contacter.')
            ->salutation('L\'équipe ImmoGestion');
    }
}