@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Posts Management</h1>
        <div class="mb-3">
            <a href="{{ route('admin.posts.create') }}" class="btn btn-success">
                Create New Post
            </a>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($posts as $post)
                    <tr>
                        <td>{{ $post->title }}</td>
                        <td>
                            <a href="{{ route('admin.posts.edit', $post->id) }}" class="btn btn-sm btn-primary">Edit</a>
                            <!-- Add delete button with form -->
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection