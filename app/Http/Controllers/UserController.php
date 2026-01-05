<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Rules\UniqueAcrossRoles;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users (admin and cashier only).
     */
    public function index()
    {
        $users = User::whereIn('role', ['admin', 'cashier'])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                new UniqueAcrossRoles('users', 'email')
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                new UniqueAcrossRoles('users', 'username')
            ],
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,cashier',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'password' => bcrypt($validated['password']),
        ]);

        // Always return JSON for AJAX/API requests or when Content-Type is application/json
        if ($request->expectsJson() || $request->is('api/*') || $request->wantsJson() || 
            $request->ajax() || $request->header('Content-Type') === 'application/json' ||
            $request->header('Accept') === 'application/json') {
            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'user' => $user->only(['id', 'name', 'email', 'username', 'phone', 'role', 'created_at', 'updated_at'])
            ]);
        }

        // Handle Inertia requests (from form)
        return redirect()->route('admin.users.index');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                new UniqueAcrossRoles('users', 'email', $user->id)
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                new UniqueAcrossRoles('users', 'username', $user->id)
            ],
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,cashier',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $user->update($updateData);

        // Always return JSON for AJAX/API requests or when Content-Type is application/json
        if ($request->expectsJson() || $request->is('api/*') || $request->wantsJson() || 
            $request->ajax() || $request->header('Content-Type') === 'application/json' ||
            $request->header('Accept') === 'application/json') {
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => $user->fresh()->only(['id', 'name', 'email', 'username', 'phone', 'role', 'created_at', 'updated_at'])
            ]);
        }

        // Handle Inertia requests (from form)
        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting admin users based on specific rules
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            
            // If there's only one admin, prevent deletion (regardless of ID)
            if ($adminCount <= 1) {
                if (request()->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the last admin user'
                    ], 400);
                }
                return redirect()->back()->withErrors(['error' => 'Cannot delete the last admin user']);
            }
            
            // If there are multiple admins, only prevent deletion of the first admin (ID 1)
            if ($user->id === 1) {
                if (request()->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the first admin user'
                    ], 400);
                }
                return redirect()->back()->withErrors(['error' => 'Cannot delete the first admin user']);
            }
        }

        $user->delete();

        // Handle API requests (from modal)
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        }

        // Handle Inertia requests (from form)
        return redirect()->route('admin.users.index');
    }
}
