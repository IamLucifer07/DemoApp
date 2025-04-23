@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Admin Dashboard</h1>
        <div class="card">
            <div class="card-body">
                <p>Welcome to the admin dashboard!</p>
                @can('manage posts')
                    <a href="{{ route('admin.posts.index') }}" class="btn btn-primary">
                        Manage Posts
                    </a>
                @endcan
            </div>
        </div>
    </div>
@endsection