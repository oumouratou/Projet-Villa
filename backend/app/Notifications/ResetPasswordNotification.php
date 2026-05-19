<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = config('app.frontend_url') . '/reinitialiser-mot-de-passe?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.')
            ->action('Réinitialiser le mot de passe', $url)
            ->line('Ce lien de réinitialisation de mot de passe expirera dans 15 minutes.')
            ->line('Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune autre action n\'est requise.');
    }
}
