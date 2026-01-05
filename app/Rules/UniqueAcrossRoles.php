<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueAcrossRoles implements ValidationRule
{
    protected $table;
    protected $column;
    protected $ignoreId;
    protected $ignoreColumn;

    public function __construct($table, $column, $ignoreId = null, $ignoreColumn = 'id')
    {
        $this->table = $table;
        $this->column = $column;
        $this->ignoreId = $ignoreId;
        $this->ignoreColumn = $ignoreColumn;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = DB::table($this->table)->where($this->column, $value);

        if ($this->ignoreId) {
            $query->where($this->ignoreColumn, '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail("The {$attribute} has already been taken by another user or customer.");
        }
    }
}