<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;

class UpdateUserPassword implements UpdatesUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and update the user's password.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            // 'password' => $this->passwordRules(),
            'password' =>[ 'required',
            'string',
            'min:8',
            'max:50',
            'regex:/[A-Z]/', 
            'regex:/[a-z]/', 
            'regex:/[0-9]/', 
            'regex:/[\W_]/', 
            'confirmed',]
        ], ['password'=>'La nueva contraseña debe tener al menos una letra mayúscula, minúscula, un número y un caracter especial',
            'current_password.current_password' => __('The provided password does not match your current password.',),
        ])->validateWithBag('updatePassword');

        $user->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();
    }
}
