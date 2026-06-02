import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function InvoiceForm({ data, setData, errors, processing, submit, isEdit, clients }) {
    return (
        <form onSubmit={submit}>
            <div className="row">
                <div className="col-md-12 mb-3">
                    <InputLabel htmlFor="client_id" value="Client" />
                    <select
                        id="client_id"
                        name="client_id"
                        className="form-select mt-1"
                        value={data.client_id}
                        onChange={(e) => setData('client_id', e.target.value)}
                        required
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name} {client.company_name ? `(${client.company_name})` : ''}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.client_id} className="mt-1" />
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <InputLabel htmlFor="issue_date" value="Issue Date" />
                    <TextInput
                        id="issue_date"
                        type="date"
                        name="issue_date"
                        value={data.issue_date}
                        className="mt-1 w-100"
                        onChange={(e) => setData('issue_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.issue_date} className="mt-1" />
                </div>

                <div className="col-md-4 mb-3">
                    <InputLabel htmlFor="due_date" value="Due Date" />
                    <TextInput
                        id="due_date"
                        type="date"
                        name="due_date"
                        value={data.due_date}
                        className="mt-1 w-100"
                        onChange={(e) => setData('due_date', e.target.value)}
                    />
                    <InputError message={errors.due_date} className="mt-1" />
                </div>

                <div className="col-md-4 mb-3">
                    <InputLabel htmlFor="amount" value="Amount" />
                    <div className="input-group mt-1">
                        <span className="input-group-text">$</span>
                        <TextInput
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            name="amount"
                            value={data.amount}
                            className="form-control"
                            onChange={(e) => setData('amount', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.amount} className="mt-1" />
                </div>
            </div>

            <div className="mb-4">
                <InputLabel htmlFor="notes" value="Notes (Optional)" />
                <textarea
                    id="notes"
                    name="notes"
                    value={data.notes}
                    className="form-control mt-1"
                    rows="3"
                    onChange={(e) => setData('notes', e.target.value)}
                ></textarea>
                <InputError message={errors.notes} className="mt-1" />
            </div>

            <div className="d-flex justify-content-end">
                <PrimaryButton disabled={processing}>
                    {isEdit ? 'Update Invoice' : 'Create Invoice'}
                </PrimaryButton>
            </div>
        </form>
    );
}
