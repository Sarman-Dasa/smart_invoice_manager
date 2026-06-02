import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <h4 className="mb-4 text-center fw-bold text-dark">Welcome Back</h4>

            {status && (
                <div className="alert alert-success mb-4" role="alert">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mb-3">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="mb-3">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="mb-3 form-check">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label className="form-check-label text-muted ms-1" htmlFor="remember">
                        Remember me
                    </label>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-4">
                    {canResetPassword ? (
                        <Link
                            href={route('password.request')}
                            className="text-decoration-none text-secondary"
                        >
                            Forgot your password?
                        </Link>
                    ) : <div></div>}

                    <PrimaryButton className="px-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
                
                <div className="text-center mt-4">
                    <span className="text-muted">Don't have an account? </span>
                    <Link href={route('register')} className="text-decoration-none">
                        Register
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
