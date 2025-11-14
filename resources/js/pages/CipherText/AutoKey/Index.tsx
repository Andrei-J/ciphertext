import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { RefreshCcw, Loader2, Key, Settings, MessageCircle, AlertTriangle } from 'lucide-react'; 

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AutoKey Cipher',
        href: ''
    },
];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-5xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-3 flex items-center space-x-3">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>{title}</span>
        </h2>
        {children}
    </div>
);

/**
 * Custom label component.
 */
const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {children}
    </label>
);

/**
 * Styled input field.
 */
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 text-base transition duration-150 ease-in-out"
    />
);

/**
 * Styled textarea field.
 */
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 text-base transition duration-150 ease-in-out resize-none"
    />
);

/**
 * Main action button with loading state.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}
const Button: React.FC<ButtonProps> = ({ children, isLoading = false, ...props }) => (
    <button
        {...props}
        disabled={isLoading || props.disabled}
        className={`
            w-full flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg
            text-white transition duration-200 ease-in-out transform hover:scale-[1.01]
            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
            disabled:opacity-60
        `}
    >
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : children}
    </button>
);

interface Step {
    plainChar: string;
    plainValue: number;
    keyChar: string;
    keyValue: number;
    sum: number;
    cipherChar: string;
}

export default function Index() {
    const [plaintext, setPlaintext] = useState('');
    const [key, setKey] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [alphabetMode, setAlphabetMode] = useState<'AZ' | 'AZ09SPACE'>('AZ09SPACE');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({ message: '', type: null });

    const alphabet = alphabetMode === 'AZ' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const modVal = alphabet.length;

    const encrypt = () => {
        setError('');
        setStatus({ message: '', type: null });
        if (!key.trim()) {
            setError('Error: Please enter a key before encrypting.');
            setStatus({ message: 'Error: Please enter a key before encrypting.', type: 'error' });
            return;
        }
        setIsLoading(true);
        const plain = plaintext.toUpperCase();
        const baseKey = key.toUpperCase();
        const fullKey = baseKey + plain;
        let result = '';
        const stepList: Step[] = [];
        for (let i = 0; i < plain.length; i++) {
            const p = alphabet.indexOf(plain[i]);
            const k = alphabet.indexOf(fullKey[i]);
            if (p === -1) {
                result += plain[i];
                continue;
            }
            const keyIndex = k === -1 ? 0 : k;
            const sum = (p + keyIndex) % modVal;
            const cipherChar = alphabet[sum];
            result += cipherChar;
            stepList.push({
                plainChar: plain[i],
                plainValue: p,
                keyChar: fullKey[i] ?? '',
                keyValue: keyIndex,
                sum,
                cipherChar,
            });
        }
        setCiphertext(result);
        setSteps(stepList);
        setMode('encrypt');
        setStatus({ message: 'Encryption Complete!', type: 'success' });
        setIsLoading(false);
    };

    const decrypt = () => {
        setError('');
        setStatus({ message: '', type: null });
        if (!key.trim()) {
            setError('Error: Please enter a key before decrypting.');
            setStatus({ message: 'Error: Please enter a key before decrypting.', type: 'error' });
            return;
        }
        setIsLoading(true);
        const cipherInput = (ciphertext || plaintext).toUpperCase();
        const baseKey = key.toUpperCase();
        let result = '';
        let dynamicKey = baseKey;
        const stepList: Step[] = [];
        for (let i = 0; i < cipherInput.length; i++) {
            const c = alphabet.indexOf(cipherInput[i]);
            if (c === -1) {
                result += cipherInput[i];
                continue;
            }
            const keyChar = dynamicKey[i] ?? ' ';
            let kIndex = alphabet.indexOf(keyChar);
            if (kIndex === -1) kIndex = 0;
            const diff = (c - kIndex + modVal) % modVal;
            const plainChar = alphabet[diff];
            result += plainChar;
            dynamicKey += plainChar;
            stepList.push({
                plainChar,
                plainValue: diff,
                keyChar,
                keyValue: kIndex,
                sum: diff,
                cipherChar: cipherInput[i],
            });
        }
        setPlaintext(result);
        setSteps(stepList);
        setMode('decrypt');
        setStatus({ message: 'Decryption Complete!', type: 'success' });
        setIsLoading(false);
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
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-inter">
                <Card title="AutoKey Cipher Calculator">
                    <Link
                        href="/CipherText/AutoKey/about"
                        className="mb-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
                    >
                        AutoKey Cipher?
                    </Link>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Plain Text Input */}
                        <div className="md:col-span-1">
                            <Label htmlFor="plaintext">Plain Text (Input)</Label>
                            <Textarea
                                id="plaintext"
                                value={plaintext}
                                onChange={(e) => setPlaintext(e.target.value)}
                                placeholder="Enter text to encrypt (e.g., ATTACKATDAWN)"
                                required
                                rows={8}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Non-alphanumeric characters are typically stripped or ignored by the cipher logic.
                            </p>
                        </div>

                        {/* Settings (Key/Alphabet Mode) */}
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 mb-2">
                                <Settings className="h-4 w-4" />
                                <span>Cipher Configuration</span>
                            </h3>
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
                                <Label htmlFor="alphabetMode">Alphabet Mode</Label>
                                <div className="relative">
                                    <select
                                        id="alphabetMode"
                                        value={alphabetMode}
                                        onChange={(e) => setAlphabetMode(e.target.value as 'AZ' | 'AZ09SPACE')}
                                        className="w-full px-4 py-2 appearance-none border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base transition duration-150 ease-in-out"
                                        required
                                    >
                                        <option value="AZ">26 (A-Z)</option>
                                        <option value="AZ09SPACE">37 (A-Z, 0-9 + Space)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Ciphertext Output */}
                        <div className="md:col-span-1">
                            <Label htmlFor="ciphertext">Ciphertext (Result)</Label>
                            <Textarea
                                id="ciphertext"
                                value={isLoading ? 'Processing...' : ciphertext}
                                placeholder="Ciphertext will appear here after successful calculation."
                                readOnly
                                rows={8}
                            />
                            <div className="mt-4 flex space-x-2">
                                <Button 
                                    onClick={encrypt} 
                                    isLoading={isLoading} 
                                    disabled={!plaintext || !key}
                                >
                                    <RefreshCcw className="h-5 w-5 mr-2" />
                                    Encrypt
                                </Button>
                                <Button 
                                    onClick={decrypt} 
                                    isLoading={isLoading} 
                                    disabled={!ciphertext && !plaintext || !key}
                                >
                                    <RefreshCcw className="h-5 w-5 mr-2" />
                                    Decrypt
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Status Message Display */}
                    {status.message && (
                        <div className={`mt-6 p-4 rounded-xl border-l-4 ${getStatusClasses()} flex items-start space-x-3`}>
                            {status.type === 'error' ? <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0" /> : <MessageCircle className="h-5 w-5 mt-1 flex-shrink-0" />}
                            <div>
                                <p className="font-semibold">{status.type === 'success' ? 'Success!' : status.type === 'error' ? 'Operation Failed' : 'Info'}</p>
                                <p className="text-sm mt-1 break-words">{status.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Steps Table */}
                    {steps.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                AutoKey Steps ({mode === 'encrypt' ? 'Encryption' : 'Decryption'}) — mod {modVal}
                            </h3>
                            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-700">
                                        {mode === 'encrypt' ? (
                                            <>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Plain</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">P(val)</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Key</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">K(val)</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">(P + K) mod {modVal}</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cipher</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cipher</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">C(val)</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Key</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">K(val)</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">(C - K) mod {modVal}</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Plain</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {steps.map((step, index) => (
                                        <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                                            {mode === 'encrypt' ? (
                                                <>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.plainChar}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.plainValue}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.keyChar}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.keyValue}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.sum}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.cipherChar}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.cipherChar}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{alphabet.indexOf(step.cipherChar)}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.keyChar}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.keyValue}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.sum}</td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{step.plainChar}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
