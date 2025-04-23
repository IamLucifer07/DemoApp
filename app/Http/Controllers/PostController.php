<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;

class PostController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $this->authorize('manage-posts');
        return view('posts.index', ['posts' => Post::all()]);
    }

    public function create()
    {
        $this->authorize('manage-posts');
        return view('posts.create');
    }

    public function store(Request $request)
    {
        $this->authorize('manage-posts');

        $validated = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $request->user()->posts()->create($validated);

        return redirect()->route('posts.index');
    }

    // ... other CRUD methods
}
