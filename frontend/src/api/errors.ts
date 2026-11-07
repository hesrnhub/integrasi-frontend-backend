import axios from 'axios';

// Bentuk error seragam untuk seluruh UI.
export interface ApiError {
  status: number | null;          // null = error jaringan (backend mati/CORS/timeout)
  message: string;
  fieldErrors: Record<string, string>; // dari errors[] backend (400 validasi)
}

interface BackendErrorBody {
  status?: string;
  message?: string;
  errors?: { field: string; message: string }[];
}

// Mengubah error Axios menjadi ApiError agar komponen tidak perlu memahami detail Axios.
export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError<BackendErrorBody>(err)) {
    if (!err.response) {
      return {
        status: null,
        message: 'Tidak dapat terhubung ke server. Pastikan backend berjalan.',
        fieldErrors: {},
      };
    }
    const body = err.response.data;
    const fieldErrors: Record<string, string> = {};
    body?.errors?.forEach((e) => {
      if (!fieldErrors[e.field]) fieldErrors[e.field] = e.message;
    });
    return {
      status: err.response.status,
      message: body?.message ?? `Terjadi kesalahan (${err.response.status})`,
      fieldErrors,
    };
  }
  return { status: null, message: 'Terjadi kesalahan tak terduga.', fieldErrors: {} };
}
