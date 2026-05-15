<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,svg,gif|max:5120', // 5MB
        ]);

        $file = $request->file('file');
        $path = $file->store('public/uploads');

        // Convert storage path to an absolute URL on the Laravel host.
        $publicPath = str_replace('public/', 'storage/', $path);
        $url = rtrim($request->getSchemeAndHttpHost(), '/') . '/' . ltrim($publicPath, '/');

        return response()->json(['data' => ['url' => $url]]);
    }
}
