<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Option::query()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:options,name'
        ]);

        $option = Option::create($request->only(['name']));

        return response()->json([
            'data' => $option,
        ], 201);
    }

    public function show(Option $option)
    {
        return response()->json([
            'data' => $option,
        ]);
    }

    public function update(Request $request, Option $option)
    {
        $request->validate([
            'name' => 'required|string|unique:options,name,' . $option->id
        ]);

        $option->update($request->only(['name']));

        return response()->json([
            'data' => $option->fresh(),
        ]);
    }

    public function destroy(Option $option)
    {
        $option->delete();

        return response()->json(['data' => true], 200);
    }
}
