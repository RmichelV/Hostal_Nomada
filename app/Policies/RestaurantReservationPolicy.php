<?php

namespace App\Policies;

use App\Models\RestaurantReservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RestaurantReservationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RestaurantReservation $restaurantReservation): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RestaurantReservation $restaurantReservation): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RestaurantReservation $restaurantReservation): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RestaurantReservation $restaurantReservation): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RestaurantReservation $restaurantReservation): bool
    {
        //
    }
}
