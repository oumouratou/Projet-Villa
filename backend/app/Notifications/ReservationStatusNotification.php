<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationStatusNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status  = $this->reservation->statut ?? 'en_attente';
        $bien    = $this->reservation->bien->title ?? 'votre bien';
        $prenom  = $notifiable->first_name ?? $notifiable->name ?? 'Client';

        $statusMessages = [
            'confirmee'  => ['Votre réservation est confirmée ! 🎉', 'Bonne nouvelle ! Votre demande a été acceptée par l\'agent.'],
            'refusee'    => ['Votre réservation a été refusée', 'Malheureusement, votre demande n\'a pas pu être acceptée.'],
            'annulee'    => ['Votre réservation a été annulée', 'Votre réservation a été annulée.'],
            'en_attente' => ['Votre réservation est en attente', 'Votre demande est en cours de traitement.'],
        ];

        [$subjectLine, $bodyLine] = $statusMessages[$status] ?? ['Mise à jour de votre réservation', 'Le statut de votre réservation a changé.'];

        $comment = $this->reservation->commentaire_agent ?? '';

        $mail = (new MailMessage)
            ->subject($subjectLine . ' — ImmoGestion')
            ->greeting('Bonjour ' . $prenom . ',')
            ->line($bodyLine)
            ->line('**Bien :** ' . $bien)
            ->line('**Statut :** ' . ucfirst($status));

        if ($comment) {
            $mail->line('**Commentaire de l\'agent :** ' . $comment);
        }

        return $mail
            ->action('Voir ma réservation', url('/client/reservations/' . $this->reservation->id))
            ->salutation('L\'équipe ImmoGestion');
    }
}