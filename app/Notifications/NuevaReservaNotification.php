<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevaReservaNotification extends Notification
{
    use Queueable;

    private $reserva;

    public function __construct($reserva)
    {
        $this->reserva = $reserva;
    }

    public function via($notifiable)
    {
        return ['database']; // Puedes incluir más canales como SMS, Slack, etc.
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line(`{$this->reserva->user->name} ha realizado una nueva reserva.`)
                    ->action('Ver Detalles', url('/reservas/' . $this->reserva->id))
                    ->line('Gracias por usar nuestra aplicación.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => `{$this->reserva->user->name} ha realizado una nueva reserva`,
            'reserva_id' => $this->reserva->id,
            'cliente' => $this->reserva->user->name,
            'check_in' => $this->reserva->check_in,
            'check_out' => $this->reserva->check_out,
            'total_price' => $this->reserva->total_price,
        ];
    }
}
