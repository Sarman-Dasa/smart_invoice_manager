import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ClientForm({ data, setData, errors, processing, submit, isEdit }) {
    return (
        <form onSubmit={submit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div className="col-md-6 mb-3">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1"
                        autoComplete="email"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        type="text"
                        name="phone"
                        value={data.phone}
                        className="mt-1"
                        autoComplete="tel"
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <InputError message={errors.phone} className="mt-1" />
                </div>

                <div className="col-md-6 mb-3">
                    <InputLabel htmlFor="company_name" value="Company Name" />
                    <TextInput
                        id="company_name"
                        type="text"
                        name="company_name"
                        value={data.company_name}
                        className="mt-1"
                        autoComplete="organization"
                        onChange={(e) => setData('company_name', e.target.value)}
                    />
                    <InputError message={errors.company_name} className="mt-1" />
                </div>
            </div>

            <div className="mb-4">
                <InputLabel htmlFor="address" value="Address" />
                <textarea
                    id="address"
                    name="address"
                    value={data.address}
                    className="form-control mt-1"
                    rows="3"
                    onChange={(e) => setData('address', e.target.value)}
                ></textarea>
                <InputError message={errors.address} className="mt-1" />
            </div>

            <div className="d-flex justify-content-end">
                <PrimaryButton disabled={processing}>
                    {isEdit ? 'Update Client' : 'Create Client'}
                </PrimaryButton>
            </div>
        </form>
    );
}
