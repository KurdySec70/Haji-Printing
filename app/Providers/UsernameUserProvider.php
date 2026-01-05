<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Hashing\Hasher;

class UsernameUserProvider implements UserProvider
{
    protected $hasher;
    protected $model;

    public function __construct(Hasher $hasher, $model)
    {
        $this->hasher = $hasher;
        $this->model = $model;
    }

    public function retrieveById($identifier)
    {
        $model = $this->createModel();
        
        // Check if identifier is numeric (ID) or string (username)
        if (is_numeric($identifier)) {
            // Use ID for lookup
            return $model->newQuery()->find($identifier);
        } else {
            // Use username for lookup
            return $model->newQuery()->where('username', $identifier)->first();
        }
    }

    public function retrieveByToken($identifier, $token)
    {
        // Remember token is not supported (column doesn't exist in database)
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        // Remember token is not supported (column doesn't exist in database)
        // Do nothing
    }

    public function retrieveByCredentials(array $credentials)
    {
        if (empty($credentials)) {
            return;
        }

        $query = $this->createModel()->newQuery();

        // Look for username in credentials
        if (isset($credentials['username'])) {
            $query->where('username', $credentials['username']);
        } elseif (isset($credentials['email'])) {
            $query->where('email', $credentials['email']);
        }

        return $query->first();
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        $plain = $credentials['password'];
        return $this->hasher->check($plain, $user->getAuthPassword());
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false)
    {
        if ($force || $this->hasher->needsRehash($user->getAuthPassword())) {
            $user->setAuthPassword($this->hasher->make($credentials['password']));
            $user->save();
        }
    }

    public function createModel()
    {
        $class = '\\' . ltrim($this->model, '\\');
        return new $class;
    }
}