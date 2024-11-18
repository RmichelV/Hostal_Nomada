<?php

namespace App\Policies;

use App\Models\RestaurantDish;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RestaurantDishPolicy
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
    public function view(User $user, RestaurantDish $restaurantDish): bool
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
    public function update(User $user, RestaurantDish $restaurantDish): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RestaurantDish $restaurantDish): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RestaurantDish $restaurantDish): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RestaurantDish $restaurantDish): bool
    {
        //
    }
}
