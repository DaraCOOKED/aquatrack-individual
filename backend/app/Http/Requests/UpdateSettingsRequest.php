<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:80'],
            'daily_goal_ml' => ['sometimes', 'required', 'integer', 'min:250', 'max:10000'],
            'timezone' => ['sometimes', 'required', 'timezone:all'],
            'reminder_enabled' => ['sometimes', 'required', 'boolean'],
            'reminder_start_time' => ['sometimes', 'required', 'date_format:H:i'],
            'reminder_end_time' => ['sometimes', 'required', 'date_format:H:i', 'after:reminder_start_time'],
            'reminder_interval_minutes' => ['sometimes', 'required', 'integer', 'min:15', 'max:720'],
        ];
    }
}
