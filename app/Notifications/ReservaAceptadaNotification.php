<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservaAceptadaNotification extends Notification
{
    use Queueable;

    private $reserva;

    public function __construct($reserva)
    {
        $this->reserva = $reserva;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line("¡Tu reserva ha sido aceptada!")
                    ->action('Ver Detalles', url('/reservation/'))
                    ->line('Gracias por usar nuestra aplicación.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Tu reserva ha sido aceptada.",
            'reserva_id' => $this->reserva->id,
            'cliente' => $this->reserva->user->name,
            'check_in' => $this->reserva->check_in,
            'check_out' => $this->reserva->check_out,
            'total_price' => $this->reserva->total_price,
        ];
    }
}
