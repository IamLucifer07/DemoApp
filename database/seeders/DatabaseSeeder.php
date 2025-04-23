<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $admin = Role::create(['name' => 'admin']);
        $editor = Role::create(['name' => 'editor']);

        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'manage posts']);

        $admin->givePermissionTo(['view dashboard', 'manage posts']);
        $editor->givePermissionTo('view dashboard');

        // Assign to user
        $user = User::first();
        $user->assignRole('admin');
    }
}
