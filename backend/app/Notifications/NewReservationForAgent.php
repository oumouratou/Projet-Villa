<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReservationForAgent extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Reservation $reservation)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $clientName = $this->reservation->client?->user?->name ?? 'Un client';
        $propertyTitle = $this->reservation->bien?->title ?? 'un de vos biens';

        return (new MailMessage)
            ->subject('Nouvelle réservation pour un de vos biens')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line("Une nouvelle réservation a été effectuée par {$clientName} pour {$propertyTitle}.")
            ->line("Dates : du {$this->reservation->date_debut} au {$this->reservation->date_fin}.")
            ->action('Voir la réservation', url('/agent/reservations'))
            ->line('Merci de traiter cette demande rapidement.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'type' => 'reservation',
            'client_name' => $this->reservation->client?->user?->name ?? 'N/A',
            'property_title' => $this->reservation->bien?->title ?? 'N/A',
            'message' => 'Nouvelle réservation en attente.',
        ];
    }
}
