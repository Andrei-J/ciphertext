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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vigenere Cipher',
        href: '',
    },
];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
}) => (
    <div className="w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 flex items-center space-x-3 border-b pb-3 text-3xl font-extrabold text-gray-900 dark:text-white">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>{title}</span>
        </h2>
        {children}
    </div>
);

/**
 * Custom label component.
 */
const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({
    htmlFor,
    children,
}) => (
    <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
        {children}
    </label>
);

/**
 * Styled input field.
 */
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
    props,
) => (
    <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
);

/**
 * Styled textarea field.
 */
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
    props,
) => (
    <textarea
        {...props}
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
);

/**
 * Main action button with loading state.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}
const Button: React.FC<ButtonProps> = ({
    children,
    isLoading = false,
    ...props
}) => (
    <button
        {...props}
        disabled={isLoading || props.disabled}
        className={`flex w-full transform items-center justify-center space-x-2 rounded-xl border border-transparent px-6 py-3 text-base font-medium text-white shadow-lg transition duration-200 ease-in-out hover:scale-[1.01] ${isLoading ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} disabled:opacity-60`}
    >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </button>
);

const N8N_WEBHOOK_URL =
    'https://n8n.larable.dev/webhook/0667a227-8e97-4692-aca0-c4a6437dfb1a';

//dev
//const N8N_WEBHOOK_URL = 'https://n8n.larable.dev/webhook-test/0667a227-8e97-4692-aca0-c4a6437dfb1a';

export default function Index() {
    const [plainText, setPlainText] = useState('');
    const [key, setKey] = useState('');
    const [mod, setMod] = useState(26);
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [ciphertext, setCiphertext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        message: string;
        type: 'success' | 'error' | 'info' | null;
    }>({ message: '', type: null });

    /**
     * Handles the form submission and communicates with the n8n webhook.
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', type: null });
        setCiphertext('');

        const payload = {
            [mode === 'encrypt' ? 'plainText' : 'ciphertext']: plainText,
            key,
            mod: Number(mod),
            mode,
            source: 'CipherAppFormSubmission',
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Expecting a JSON response from the n8n webhook's 'Response' node
                const result = await response.json();
                const data = Array.isArray(result) ? result[0] : result;
                const finalCiphertext =
                    data.ciphertext ||
                    data.plaintext ||
                    'No ciphertext or plaintext found in response.';

                setCiphertext(finalCiphertext);

                setStatus({
                    message: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} Complete! The external service has successfully returned the result.`,
                    type: 'success',
                });
            } else {
                let errorDetails = `Server responded with status ${response.status}.`;
                try {
                    const errorJson = await response.json();
                    errorDetails =
                        errorJson.message || JSON.stringify(errorJson);
                } catch {
                    errorDetails = await response.text();
                }

                setStatus({
                    message: `Webhook failed: ${errorDetails.substring(0, 200)}`,
                    type: 'error',
                });
            }
        } catch (error) {
            setStatus({
                message: `Network Error: Could not reach the webhook URL. Check your URL and network connection.`,
                type: 'error',
            });
            console.error('Webhook Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Determines the CSS classes for the status message box based on type.
     */
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
            <Head title="" />
            <div className="font-inter flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <Card title="Vigenere Cipher Calculator">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Plain Text Input */}
                            <div className="md:col-span-1">
                                <Label htmlFor="plainText">
                                    Plain Text (Input)
                                </Label>
                                <Textarea
                                    id="plainText"
                                    value={plainText}
                                    onChange={(e) =>
                                        setPlainText(e.target.value)
                                    }
                                    placeholder="Enter text to encrypt (e.g., ATTACKATDAWN)"
                                    required
                                    rows={8}
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Non-alphanumeric characters are typically
                                    stripped or ignored by the cipher logic.
                                </p>
                            </div>

                            {/* Settings (Mode/Key/Mod) */}
                            <div className="space-y-4 md:col-span-1">
                                <h3 className="mb-2 flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    <Settings className="h-4 w-4" />
                                    <span>Cipher Configuration</span>
                                </h3>
                                <div>
                                    <Label htmlFor="mode">Mode</Label>
                                    <div className="relative">
                                        <select
                                            id="mode"
                                            value={mode}
                                            onChange={(e) =>
                                                setMode(
                                                    e.target.value as
                                                        | 'encrypt'
                                                        | 'decrypt',
                                                )
                                            }
                                            className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="encrypt">
                                                Encrypt
                                            </option>
                                            <option value="decrypt">
                                                Decrypt
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="key">Encryption Key</Label>
                                    <Input
                                        id="key"
                                        type="text"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        placeholder="Key (e.g., LEMON)"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mod">
                                        Modulus (Alphabet Size)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="mod"
                                            value={mod}
                                            onChange={(e) =>
                                                setMod(parseInt(e.target.value))
                                            }
                                            className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value={26}>26 (A-Z)</option>
                                            <option value={27}>
                                                27 (A-Z + Space)
                                            </option>
                                            <option value={37}>
                                                37 (A-Z, 0-9 + Space)
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Ciphertext Output */}
                            <div className="md:col-span-1">
                                <Label htmlFor="ciphertext">
                                    Ciphertext (Result)
                                </Label>
                                <Textarea
                                    id="ciphertext"
                                    value={
                                        isLoading
                                            ? 'Awaiting response from external service...'
                                            : ciphertext
                                    }
                                    placeholder="Ciphertext will appear here after successful calculation."
                                    readOnly
                                    rows={8}
                                />
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={!plainText || !key || mod < 1}
                                    className="mt-4"
                                >
                                    <RefreshCcw className="mr-2 h-5 w-5" />
                                    {isLoading
                                        ? 'Sending Request...'
                                        : `${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} via Webhook`}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Status Message Display */}
                    {status.message && (
                        <div
                            className={`mt-6 rounded-xl border-l-4 p-4 ${getStatusClasses()} flex items-start space-x-3`}
                        >
                            {status.type === 'error' ? (
                                <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
                            ) : (
                                <MessageCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                            )}
                            <div>
                                <p className="font-semibold">
                                    {status.type === 'success'
                                        ? 'Success!'
                                        : status.type === 'error'
                                          ? 'Operation Failed'
                                          : 'Info'}
                                </p>
                                <p className="mt-1 text-sm break-words">
                                    {status.message}
                                </p>
                            </div>
                        </div>
                    )}
                    <a
                        href="https://vigenereciphers.larable.dev/"
                        target="_blank"
                        className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Click here to visit the full website!
                    </a>
                </Card>
            </div>
        </AppLayout>
    );
}
