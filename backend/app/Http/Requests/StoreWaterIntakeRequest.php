<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWaterIntakeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_ml' => ['required', 'integer', 'min:1', 'max:10000'],
            'consumed_at' => ['required', 'date'],
        ];
    }
}
