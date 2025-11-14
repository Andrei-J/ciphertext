import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Key,
    Loader2,
    MessageCircle,
    RefreshCcw,
    Settings,
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Affine Cipher', href: '' }];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 flex items-center space-x-3 border-b pb-3 text-3xl font-extrabold text-gray-900 dark:text-white">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>{title}</span>
        </h2>
        {children}
    </div>
);

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {children}
    </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}
const Button: React.FC<ButtonProps> = ({ children, isLoading = false, ...props }) => (
    <button
        {...props}
        disabled={isLoading || props.disabled}
        className={`flex w-full transform items-center justify-center space-x-2 rounded-xl border border-transparent px-6 py-3 text-base font-medium text-white shadow-lg transition duration-200 ease-in-out hover:scale-[1.01] ${
            isLoading
                ? 'cursor-not-allowed bg-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        } disabled:opacity-60`}
    >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </button>
);

interface Step {
    inputChar: string;
    inputValue: number;
    a: number;
    b: number;
    resultChar: string;
}

const N8N_WEBHOOK_URL = 'https://n8n.larable.dev/webhook/a431560a-13dc-44b5-8083-4d02a2656100';

//dev
//const N8N_WEBHOOK_URL = 'https://n8n.larable.dev/webhook-test/a431560a-13dc-44b5-8083-4d02a2656100';

export default function AffineCipherPage() {
    const [text, setText] = useState('');
    const [keyA, setKeyA] = useState(5);
    const [keyB, setKeyB] = useState(8);
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [alphabetType, setAlphabetType] = useState<'A-Z' | 'A-Z 0-9 SPACE'>('A-Z');
    const [result, setResult] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({
        message: '',
        type: null,
    });

    const getAlphabet = () => {
        return alphabetType === 'A-Z'
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', type: null });
        setResult('');
        setSteps([]);

        const payload = {
            [mode === 'encrypt' ? 'plaintext' : 'ciphertext']: text,
            a: Number(keyA),
            b: Number(keyB),
            mode,
            alphabetType,
            source: 'AffineCipherUI',
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const resultData = await response.json();
                const data = Array.isArray(resultData) ? resultData[0] : resultData;
                const output = data.result || data.ciphertext || data.plaintext || 'No result returned.';
                setResult(output);

                const alphabet = getAlphabet();
                const upperText = text.toUpperCase();
                const upperOutput = output.toUpperCase();
                const newSteps: Step[] = [];
                for (let i = 0; i < upperText.length; i++) {
                    const inputChar = upperText[i];
                    const inputValue = alphabet.indexOf(inputChar);
                    if (inputValue === -1) continue;
                    const resultChar = upperOutput[i];
                    newSteps.push({ inputChar, inputValue, a: Number(keyA), b: Number(keyB), resultChar });
                }
                setSteps(newSteps);

                setStatus({
                    message: `Successfully ${mode === 'encrypt' ? 'encrypted' : 'decrypted'}!`,
                    type: 'success',
                });
            } else {
                let errorDetails = await response.text();
                setStatus({
                    message: `Webhook Error (${response.status}): ${errorDetails.substring(0, 200)}`,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Webhook Fetch Error:', error);
            setStatus({
                message: 'Network Error: Could not reach the webhook URL. Check your connection or n8n settings.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusClasses = () => {
        switch (status.type) {
            case 'success':
                return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700';
            case 'error':
                return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Affine Cipher Calculator" />
            <div className="font-inter flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <Card title="Affine Cipher Calculator">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Input */}
                            <div className="md:col-span-1">
                                <Label htmlFor="text">{mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}</Label>
                                <Textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={mode === 'encrypt' ? 'Enter text to encrypt (e.g., HELLO WORLD)' : 'Enter ciphertext to decrypt'}
                                    required
                                    rows={8}
                                />
                            </div>

                            {/* Config */}
                            <div className="space-y-4 md:col-span-1">
                                <h3 className="mb-2 flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    <Settings className="h-4 w-4" />
                                    <span>Cipher Configuration</span>
                                </h3>

                                <div>
                                    <Label htmlFor="mode">Mode</Label>
                                    <select
                                        id="mode"
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                                        className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="encrypt">Encrypt</option>
                                        <option value="decrypt">Decrypt</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="keyA">Key A (coprime with alphabet length)</Label>
                                    <Input
                                        id="keyA"
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={keyA}
                                        onChange={(e) => setKeyA(parseInt(e.target.value || '1'))}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="keyB">Key B (0–99)</Label>
                                    <Input
                                        id="keyB"
                                        type="number"
                                        min={0}
                                        max={99}
                                        value={keyB}
                                        onChange={(e) => setKeyB(parseInt(e.target.value || '0'))}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="alphabetType">Alphabet Type</Label>
                                    <select
                                        id="alphabetType"
                                        value={alphabetType}
                                        onChange={(e) => setAlphabetType(e.target.value as 'A-Z' | 'A-Z 0-9 SPACE')}
                                        className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="A-Z">A-Z</option>
                                        <option value="A-Z 0-9 SPACE">A-Z, 0-9, SPACE</option>
                                    </select>
                                </div>
                            </div>

                            {/* Output */}
                            <div className="md:col-span-1">
                                <Label htmlFor="result">{mode === 'encrypt' ? 'Ciphertext (Result)' : 'Plaintext (Result)'}</Label>
                                <Textarea
                                    id="result"
                                    value={isLoading ? 'Processing...' : result}
                                    placeholder="Result will appear here after encryption/decryption."
                                    readOnly
                                    rows={8}
                                />
                                <Button type="submit" isLoading={isLoading} disabled={!text} className="mt-4">
                                    <RefreshCcw className="mr-2 h-5 w-5" />
                                    {isLoading ? 'Processing...' : `${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Text`}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Status Message */}
                    {status.message && (
                        <div className={`mt-6 rounded-xl border-l-4 p-4 ${getStatusClasses()} flex items-start space-x-3`}>
                            {status.type === 'error' ? (
                                <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
                            ) : (
                                <MessageCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                            )}
                            <div>
                                <p className="font-semibold">
                                    {status.type === 'success' ? 'Success!' : status.type === 'error' ? 'Operation Failed' : 'Info'}
                                </p>
                                <p className="mt-1 text-sm break-words">{status.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Steps Table */}
                    {steps.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Affine Cipher Steps ({mode === 'encrypt' ? 'Encryption' : 'Decryption'})
                            </h3>
                            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-700">
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Input</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Value</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">a</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">b</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {steps.map((step, index) => (
                                        <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.inputChar}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.inputValue}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.a}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.b}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.resultChar}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <a
                        href="https://affinecipher.larable.dev/"
                        target="_blank"
                        className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Visit Full Affine Cipher Website
                    </a>
                </Card>
            </div>
        </AppLayout>
    );
}
