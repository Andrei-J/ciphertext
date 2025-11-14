import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/CipherText/AutoKey',
    },
];

export default function About() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AutoKey Cipher" />

            

            <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 text-gray-900 transition-colors duration-300 sm:p-8 md:p-10 dark:bg-gray-900 dark:text-gray-100">
                {/* Title */}
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-extrabold tracking-wide text-indigo-700 sm:text-4xl dark:text-indigo-400">
                        <i>About AutoKey Cipher</i>
                    </h1>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg dark:text-gray-400">
                        Learn the history, background, and working principles of
                        the AutoKey Cipher — a clever improvement over the
                        classic Vigenère Cipher.
                    </p>
                </div>

                {/* Info Sections */}
                <div className="mt-6 grid grid-cols-1 gap-8">
                    {/* History */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-3 text-2xl font-semibold text-indigo-600 sm:text-3xl dark:text-indigo-300">
                            History
                        </h2>
                        <p className="text-justify leading-relaxed">
                            The AutoKey Cipher is a polyalphabetic substitution
                            cipher, considered a more advanced version of the
                            Vigenère Cipher. It was first described by Giovanni
                            Battista Bellaso in 1553, and later improved and
                            popularized by Blaise de Vigenère in 1586. The
                            AutoKey variant was developed to address a major
                            weakness in the classic Vigenère cipher: the
                            repetition of the key, which made it susceptible to
                            frequency analysis attacks.
                        </p>
                    </section>

                    {/* Background */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-3 text-2xl font-semibold text-indigo-600 sm:text-3xl dark:text-indigo-300">
                            Background
                        </h2>
                        <p className="text-justify leading-relaxed">
                            Unlike the Vigenère cipher, which uses a fixed
                            repeating key, the AutoKey cipher extends the key by
                            appending the plaintext itself to the initial key.
                            This creates a longer, non-repeating key stream,
                            making it theoretically more secure against certain
                            cryptanalysis techniques. It operates on the
                            principle of polyalphabetic substitution, where each
                            letter of the plaintext is shifted by a
                            corresponding letter in the key stream, typically
                            using modular arithmetic (e.g., A=0, B=1, ...,
                            Z=25).
                        </p>
                    </section>

                    {/* Encryption and Decryption */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-3 text-2xl font-semibold text-indigo-600 sm:text-3xl dark:text-indigo-300">
                            Encryption and Decryption
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <h3 className="mb-2 text-xl font-medium">
                                    Encryption
                                </h3>
                                <p className="mb-2 text-justify leading-relaxed">
                                    To encrypt a message, start with an initial
                                    key (e.g., "KEY"). Append the plaintext to
                                    this key to form the full key stream. For
                                    each letter in the plaintext, add the
                                    corresponding key letter's value (mod 26) to
                                    get the ciphertext letter.
                                </p>
                                <p className="text-sm leading-relaxed sm:text-base">
                                    <strong>Example:</strong> Plaintext:
                                    "HELLO", Initial Key: "KEY". Full Key:
                                    "KEYHE". Ciphertext: (H+K)=(7+10)=17=R,
                                    (E+E)=(4+4)=8=I, (L+Y)=(11+24)=9=J,
                                    (L+H)=(11+7)=18=S, (O+E)=(14+4)=18=S.
                                    Result: "RIJSS".
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium">
                                    Decryption
                                </h3>
                                <p className="mb-2 text-justify leading-relaxed">
                                    Decryption reverses the process. Use the
                                    initial key to decrypt the first few
                                    letters, then use the decrypted plaintext as
                                    part of the key for subsequent letters.
                                </p>
                                <p className="text-sm leading-relaxed sm:text-base">
                                    <strong>Example:</strong> Ciphertext:
                                    "RIJSS", Initial Key: "KEY". Decrypt:
                                    R-K=7=H, I-E=4=E, J-Y=11=L, S-H=18=L,
                                    S-E=18=O. Result: "HELLO".
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Advantages and Disadvantages */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-3 text-2xl font-semibold text-indigo-600 sm:text-3xl dark:text-indigo-300">
                            Advantages and Disadvantages
                        </h2>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-green-500">
                                    Advantages
                                </h3>
                                <ul className="list-inside list-disc space-y-1 leading-relaxed">
                                    <li>
                                        Eliminates key repetition, making it
                                        resistant to simple frequency analysis.
                                    </li>
                                    <li>
                                        Provides a longer key stream, increasing
                                        security for longer messages.
                                    </li>
                                    <li>
                                        Simple to implement manually or
                                        programmatically.
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-red-500">
                                    Disadvantages
                                </h3>
                                <ul className="list-inside list-disc space-y-1 leading-relaxed">
                                    <li>
                                        Vulnerable to known-plaintext and
                                        Kasiski attacks with short keys.
                                    </li>
                                    <li>Requires secure key sharing.</li>
                                    <li>
                                        Obsolete compared to modern standards
                                        like AES.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
