<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Client::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'phone' => 'required|string',
            'address' => 'required|string',
        ]);

        return Client::create($request->all());
    }

    public function show(Client $client)
    {
        return $client;
    }

    public function update(Request $request, Client $client)
    {
        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'phone' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
        ]);

        $client->update($request->all());

        return $client;
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json(null, 204);
    }
}
