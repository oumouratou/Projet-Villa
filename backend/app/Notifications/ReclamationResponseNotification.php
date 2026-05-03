<?php

namespace App\Notifications;

use App\Models\Reclamation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReclamationResponseNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Reclamation $reclamation) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
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