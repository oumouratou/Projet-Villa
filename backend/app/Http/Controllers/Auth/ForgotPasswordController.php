<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Carbon\Carbon;
use App\Notifications\ResetPasswordNotification;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Aucun utilisateur trouvé avec cette adresse email.'], 404);
        }

        // Delete old tokens
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Create new token
        $token = Str::random(60);
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        // Send notification
        try {
            $user->notify(new ResetPasswordNotification($token));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Impossible d\'envoyer l\'email de réinitialisation. Veuillez réessayer plus tard.'], 500);
        }

        return response()->json(['message' => 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.']);
    }
}
