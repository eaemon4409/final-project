<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CompareRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'installId' => ['required', 'string', 'max:100'],
            'goal' => ['nullable', 'string', 'max:500'],
            'pages' => ['required', 'array', 'min:2', 'max:4'],
            'pages.*.id' => ['required', 'string', 'max:50'],
            'pages.*.url' => ['required', 'string', 'max:2048'],
            'pages.*.domain' => ['required', 'string', 'max:255'],
            'pages.*.title' => ['required', 'string', 'max:500'],
            'pages.*.description' => ['nullable', 'string', 'max:1000'],
            'pages.*.importantText' => ['required', 'string', 'max:10000'],
            'pages.*.structuredData' => ['nullable', 'string', 'max:10000'],
            'pages.*.capturedAt' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'pages.min' => 'Add at least one more page to compare (2 to 4 pages required).',
            'pages.max' => 'Maximum 4 pages can be compared at once.',
            'pages.required' => 'At least two pages must be selected for comparison.',
            'installId.required' => 'Anonymous install ID is required for comparison.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors(),
        ], 422));
    }
}
